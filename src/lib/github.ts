type GithubEnv = {
  token: string;
  owner: string;
  repo: string;
  baseBranch: string;
};

function getGithubEnv(): GithubEnv {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';

  if (!token || !owner || !repo) {
    throw new Error('Missing GitHub configuration (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO).');
  }

  return { token, owner, repo, baseBranch };
}

async function ghFetch(path: string, init: RequestInit = {}) {
  const { token } = getGithubEnv();
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error ${res.status} ${res.statusText}: ${text}`);
  }

  return res;
}

async function getRefSha(ref: string): Promise<string> {
  const { owner, repo } = getGithubEnv();
  const res = await ghFetch(`/repos/${owner}/${repo}/git/ref/${encodeURIComponent(ref)}`);
  const json: any = await res.json();
  return json.object.sha as string;
}

async function createBranch(branchName: string, fromBranch: string) {
  const { owner, repo } = getGithubEnv();
  const baseSha = await getRefSha(`heads/${fromBranch}`);

  await ghFetch(`/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    }),
  });
}

async function getFileSha(pathInRepo: string, branch: string): Promise<string | null> {
  const { owner, repo } = getGithubEnv();
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${getGithubEnv().token}`,
      },
      cache: 'no-store',
    }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error ${res.status} ${res.statusText}: ${text}`);
  }

  const json: any = await res.json();
  return (json.sha as string) || null;
}

export async function upsertFile(opts: {
  branch: string;
  path: string;
  contentBase64: string;
  message: string;
}) {
  const { owner, repo } = getGithubEnv();
  const existingSha = await getFileSha(opts.path, opts.branch);

  await ghFetch(`/repos/${owner}/${repo}/contents/${opts.path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: opts.message,
      content: opts.contentBase64,
      branch: opts.branch,
      sha: existingSha ?? undefined,
    }),
  });
}

export async function deleteFile(opts: {
  branch: string;
  path: string;
  message: string;
}) {
  const { owner, repo } = getGithubEnv();
  const sha = await getFileSha(opts.path, opts.branch);
  if (!sha) return;

  await ghFetch(`/repos/${owner}/${repo}/contents/${opts.path}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message: opts.message,
      branch: opts.branch,
      sha,
    }),
  });
}

export async function createPullRequest(opts: {
  branch: string;
  title: string;
  body: string;
}) {
  const { owner, repo, baseBranch } = getGithubEnv();
  const res = await ghFetch(`/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: opts.title,
      head: opts.branch,
      base: baseBranch,
      body: opts.body,
    }),
  });
  const json: any = await res.json();
  return {
    url: json.html_url as string,
    number: json.number as number,
  };
}

export function getBaseBranch() {
  return getGithubEnv().baseBranch;
}

export async function createCmsBranch(prefix: string) {
  const { baseBranch } = getGithubEnv();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const branch = `cms/${prefix}/${stamp}`;
  await createBranch(branch, baseBranch);
  return branch;
}

