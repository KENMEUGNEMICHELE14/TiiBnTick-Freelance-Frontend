import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Cookies et Publicités - TiiBnTick',
  description: 'Avis relatif aux cookies, traceurs et publicités TiiBnTick — Version Bêta 1.0',
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full inline-block" />
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function CookiesPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <div className="mb-10 pb-6 border-b border-orange-100">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Bêta publiée — Version 1.0 — 25 juillet 2026 — Code: TBT-LEGAL-COOKIES-ADS-ENFR-1.0
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Politique de Cookies, Traceurs et Publicités
        </h1>
        <p className="text-base text-gray-500 mb-1 italic">Cookies, Trackers and Advertising Notice</p>
        <p className="text-gray-500 text-sm max-w-2xl">
          Technologies web, mobiles, PWA, SDK, mesure d&apos;audience et contenus sponsorisés TiiBnTick.
        </p>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>IMPORTANT</strong> — Ce document régit une version bêta publiée susceptible d&apos;évoluer. Il doit être lu avec les avis ou conditions spécifiques affichés dans un module, une commande, une offre, un contrat partenaire ou une intégration API.
        </div>
      </div>

      <div className="space-y-8">
        <Card title="1. Qu'est-ce qu'un cookie ?">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) lors de votre visite sur nos plateformes. Les cookies et traceurs permettent à TiiBnTick de vous reconnaître, de mémoriser vos préférences et d&apos;améliorer votre expérience.</p>
          </div>
        </Card>

        <Card title="2. Types de cookies utilisés">
          <div className="text-sm text-gray-600 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">🔒 Cookies strictement nécessaires</h3>
              <p>Indispensables au fonctionnement des plateformes. Ils permettent la navigation, la gestion de la session de connexion et la sécurité. Ces cookies ne peuvent pas être désactivés sans impacter les services.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">📊 Cookies de performance et d&apos;analyse</h3>
              <p>Permettent de mesurer l&apos;audience, d&apos;analyser les comportements de navigation et d&apos;identifier les problèmes techniques afin d&apos;améliorer nos services. Collectent des informations anonymisées.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">⚙️ Cookies de fonctionnalité</h3>
              <p>Permettent de mémoriser vos préférences (langue, région, paramètres d&apos;affichage) pour personnaliser votre expérience.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">📢 Cookies publicitaires</h3>
              <p>Permettent d&apos;afficher des publicités pertinentes et mesurer l&apos;efficacité des campagnes marketing TiiBnTick. Ces cookies nécessitent votre consentement préalable.</p>
            </div>
          </div>
        </Card>

        <Card title="3. Stockage local et technologies similaires">
          <div className="text-sm text-gray-600 space-y-3">
            <p>En complément des cookies, TiiBnTick utilise les technologies suivantes :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>LocalStorage / SessionStorage :</strong> stockage de données de session et de préférences utilisateur côté navigateur.</li>
              <li><strong>Service Workers (PWA) :</strong> mise en cache pour le fonctionnement hors ligne des applications progressives TiiBnTick.</li>
              <li><strong>SDK mobiles :</strong> collecte de données d&apos;usage et de performance dans les applications mobiles.</li>
              <li><strong>Pixels de suivi :</strong> mesure des conversions et performance des publicités.</li>
            </ul>
          </div>
        </Card>

        <Card title="4. Publicités et contenus sponsorisés">
          <div className="text-sm text-gray-600 space-y-3">
            <p>TiiBnTick peut afficher des contenus sponsorisés et des publicités sur ses plateformes. Ces publicités peuvent être personnalisées en fonction de vos centres d&apos;intérêt, de votre localisation et de votre comportement de navigation.</p>
            <p>Vous pouvez gérer vos préférences publicitaires depuis le panneau de gestion des cookies accessible sur nos plateformes.</p>
          </div>
        </Card>

        <Card title="5. Durée de conservation des cookies">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="text-left p-2.5 font-semibold text-gray-700 border border-orange-100">Type</th>
                    <th className="text-left p-2.5 font-semibold text-gray-700 border border-orange-100">Durée maximale</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Cookies de session', duree: 'Fin de session navigateur' },
                    { type: 'Cookies d\'authentification', duree: '30 jours' },
                    { type: 'Cookies de préférences', duree: '12 mois' },
                    { type: 'Cookies analytiques', duree: '13 mois' },
                    { type: 'Cookies publicitaires', duree: '13 mois' },
                  ].map((row) => (
                    <tr key={row.type} className="hover:bg-gray-50">
                      <td className="p-2.5 border border-gray-100">{row.type}</td>
                      <td className="p-2.5 border border-gray-100">{row.duree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card title="6. Gérer vos préférences cookies">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Vous pouvez à tout moment modifier vos préférences concernant les cookies :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Via notre panneau de gestion :</strong> accessible depuis le lien &laquo; Préférences cookies &raquo; présent en bas de chaque page.</li>
              <li><strong>Via les paramètres de votre navigateur :</strong> vous pouvez configurer, bloquer ou supprimer les cookies depuis les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge, etc.).</li>
              <li><strong>Via les plateformes publicitaires :</strong> certains partenaires offrent des outils d&apos;opt-out spécifiques à leurs technologies.</li>
            </ul>
            <p className="text-orange-700 bg-orange-50 rounded-lg p-3 border border-orange-100">
              ⚠️ La désactivation des cookies strictement nécessaires peut affecter le bon fonctionnement des services TiiBnTick.
            </p>
          </div>
        </Card>

        <Card title="7. Contact">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Pour toute question relative à notre utilisation des cookies : <a href="mailto:privacy@yowyob.com" className="text-orange-600 hover:underline">privacy@yowyob.com</a></p>
          </div>
        </Card>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">Version et mises à jour</p>
          <p>Document TBT-LEGAL-COOKIES-ADS-ENFR-1.0 — Première version consolidée couvrant cookies, SDK, stockage local, analytics, publicités et choix utilisateurs. Statut : Bêta publiée. Date : 25 juillet 2026.</p>
        </div>
      </div>
    </article>
  )
}
