export const sitePages = ['home', 'about', 'contact'] as const;
export type SitePage = typeof sitePages[number];
export const siteTemplates = {
  home: {
    profileImage: '', profileAlt: '', name: '', role: '', highlights: [''],
    intro: { headingPrefix: '', headingHighlight: '', paragraph: '' },
    stats: [{ number: '', label: '' }], sectionOrder: [''], toolsTitle: '',
    toolsCategories: [{ title: '', items: [''] }],
    cta: { primary: { text: '', href: '' }, secondary: { text: '', href: '' } },
  },
  about: { heading: '', paragraphs: [''], skills: [''], photos: [{ imageSrc: '', imageAlt: '', position: '', fit: '' }] },
  contact: { heading: '', imageSrc: '', imageAlt: '', email: '', location: '', social: { linkedin: '' } },
};

export function isSitePage(value: string): value is SitePage {
  return sitePages.some(page => page === value);
}

function validateShape(value: any, template: any, field: string): void {
  if (typeof template === 'string') {
    if (typeof value !== 'string' || value.length > 20000) throw new Error(`${field} must be text (maximum 20,000 characters).`);
    if (/href|linkedin|profileImage|imageSrc/.test(field) && value &&
        !(/^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value) || /^mailto:/i.test(value))) {
      throw new Error(`${field} must be a local path or an http, https or mailto link.`);
    }
    return;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value) || value.length > 100) throw new Error(`${field} must be a list of at most 100 entries.`);
    value.forEach((entry, index) => validateShape(entry, template[0], `${field}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${field} must be an object.`);
  for (const key of Object.keys(value)) {
    if (!Object.prototype.hasOwnProperty.call(template, key)) throw new Error(`Unsupported field: ${field}.${key}`);
  }
  for (const key of Object.keys(template)) validateShape(value[key], template[key], `${field}.${key}`);
}

export function validateSiteContent(page: SitePage, value: any): void {
  const { featuredProjects, ...content } = value ?? {};
  if (page === 'home') {
    content.sectionOrder ??= ['intro', 'projects', 'tools'];
    if (!Array.isArray(content.sectionOrder) || content.sectionOrder.length !== 3 ||
      new Set(content.sectionOrder).size !== 3 || content.sectionOrder.some((entry: string) => !['intro', 'projects', 'tools'].includes(entry))) {
      throw new Error('Section order must contain intro, projects and tools exactly once.');
    }
  }
  if (page === 'about') {
    if (content.photos === undefined) content.photos = [];
    if (Array.isArray(content.photos)) content.photos = content.photos.map((photo: any) => photo && typeof photo === 'object' && !Array.isArray(photo) ? { fit: 'cover', ...photo } : photo);
  }
  validateShape(content, siteTemplates[page], page);
  if (featuredProjects !== undefined) {
    if (page !== 'home') throw new Error('Featured settings belong to Home.');
    validateShape(featuredProjects, { mode: '', slugs: [''], limit: '' }, 'featuredProjects');
    if (!['automatic', 'manual'].includes(featuredProjects.mode)) throw new Error('Invalid featured selection mode.');
    if (!/^([1-9]|[12][0-9]|30)$/.test(featuredProjects.limit)) throw new Error('Display count must be between 1 and 30.');
    if (new Set(featuredProjects.slugs).size !== featuredProjects.slugs.length ||
        featuredProjects.slugs.some((slug: string) => !/^[a-z0-9-]+$/.test(slug))) throw new Error('Featured projects must have unique valid identifiers.');
  }
}
