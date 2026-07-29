import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Légal - TiiBnTick',
  description: 'Mentions légales, Conditions d\'Utilisation, Politique de confidentialité et Politique de Cookies TiiBnTick',
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-orange-200 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">TiiB<span className="text-orange-500">n</span>Tick</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      {/* Nav Legal */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {[
              { href: '/legal/mentions-legales', label: 'Mentions Légales' },
              { href: '/legal/cgu', label: 'CGU' },
              { href: '/legal/privacy', label: 'Confidentialité' },
              { href: '/legal/cookies', label: 'Cookies & Publicités' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          © 2026 TiiBnTick — Un système Yowyob Inc. Ltd. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
