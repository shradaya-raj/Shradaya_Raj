'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
          <button onClick={() => window.location.reload()} className="block mx-auto mt-4 text-blue-300 underline">Reload page files</button>
        </div>
      </div>
    </main>
  )
}
