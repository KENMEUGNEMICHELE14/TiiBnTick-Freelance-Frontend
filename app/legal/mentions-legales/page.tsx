import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions Légales - TiiBnTick',
  description: 'Mentions légales de TiiBnTick — Un système Yowyob Inc. Ltd.',
}

export default function MentionsLegalesPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <div className="mb-10 pb-6 border-b border-orange-100">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Bêta publiée — Version 1.0 — 25 juillet 2026
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Mentions Légales
        </h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Informations légales relatives à l'éditeur, l'hébergement et l'exploitation des plateformes TiiBnTick.
        </p>
      </div>

      <section className="space-y-8">
        <Card title="Éditeur de la plateforme">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="font-semibold text-gray-700">Dénomination sociale</dt><dd className="text-gray-600">Yowyob Inc. Ltd</dd></div>
            <div><dt className="font-semibold text-gray-700">Marque commerciale</dt><dd className="text-gray-600">TiiBnTick</dd></div>
            <div><dt className="font-semibold text-gray-700">Forme juridique</dt><dd className="text-gray-600">Société privée à responsabilité limitée (Inc. Ltd)</dd></div>
            <div><dt className="font-semibold text-gray-700">Statut opérationnel</dt><dd className="text-gray-600">Bêta publiée</dd></div>
            <div><dt className="font-semibold text-gray-700">Email de contact</dt><dd className="text-gray-600"><a href="mailto:contact@tiibntick.com" className="text-orange-600 hover:underline">contact@tiibntick.com</a></dd></div>
            <div><dt className="font-semibold text-gray-700">Email légal</dt><dd className="text-gray-600"><a href="mailto:legal@yowyob.com" className="text-orange-600 hover:underline">legal@yowyob.com</a></dd></div>
          </dl>
        </Card>

        <Card title="Plateformes TiiBnTick">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-50">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-orange-100 rounded-tl-lg">Plateforme</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-orange-100">Adresse</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-orange-100 rounded-tr-lg">Fonction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'TiiBnTick Link', url: 'https://tiibntick.yowyob.com/en', fn: 'Portail public, création d\'envois, suivi' },
                  { name: 'TiiBnTick Go', url: 'https://tiibntick-go.yowyob.com/', fn: 'Place de marché des opportunités de livraison' },
                  { name: 'TiiBnTick Agency', url: 'https://tiibntick-agency.yowyob.com/', fn: 'Tableau de bord des agences et partenaires' },
                  { name: 'TiiBnTick Market', url: 'https://tiibntick-market.yowyob.com/en', fn: 'Commerce et promotions' },
                  { name: 'TiiBnTick Point', url: 'https://tiibntick-point.yowyob.com/', fn: 'Relais, dépôts et points de service' },
                  { name: 'TiiBnTick Core', url: 'https://tiibntick-core.yowyob.com/', fn: 'Infrastructure centrale (interne)' },
                  { name: 'API TiiBnTick', url: 'https://tiibntick-api.yowyob.com/', fn: 'Intégrations techniques partenaires' },
                ].map((p) => (
                  <tr key={p.name} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800 border border-gray-100">{p.name}</td>
                    <td className="p-3 border border-gray-100">
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-xs break-all">{p.url}</a>
                    </td>
                    <td className="p-3 text-gray-600 border border-gray-100">{p.fn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Directeur de la publication">
          <p className="text-gray-600 text-sm">
            Le directeur de la publication est le représentant légal de Yowyob Inc. Ltd, joignable à l'adresse email : <a href="mailto:legal@yowyob.com" className="text-orange-600 hover:underline">legal@yowyob.com</a>.
          </p>
        </Card>

        <Card title="Hébergement">
          <p className="text-gray-600 text-sm">
            Les plateformes TiiBnTick sont hébergées sur des infrastructures cloud sécurisées. Pour toute demande relative à l'hébergement, contacter <a href="mailto:tech@yowyob.com" className="text-orange-600 hover:underline">tech@yowyob.com</a>.
          </p>
        </Card>

        <Card title="Propriété intellectuelle">
          <p className="text-gray-600 text-sm">
            L'ensemble des contenus (textes, images, logos, marques, codes sources) présents sur les plateformes TiiBnTick sont la propriété exclusive de Yowyob Inc. Ltd, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments est interdite sans l'autorisation préalable écrite de Yowyob Inc. Ltd.
          </p>
          <p className="text-gray-600 text-sm mt-3">
            La marque <strong>TiiBnTick</strong> et le logo associé sont des marques déposées ou en cours d'enregistrement appartenant à Yowyob Inc. Ltd.
          </p>
        </Card>

        <Card title="Droit applicable et juridiction">
          <p className="text-gray-600 text-sm">
            Ces mentions légales sont régies par le droit camerounais, notamment la loi n°2010/021 du 21 décembre 2010 régissant le commerce électronique, et la loi de 2024 sur la protection des données personnelles au Cameroun. Tout litige relatif à ces mentions sera soumis à la compétence exclusive des juridictions compétentes du Cameroun.
          </p>
        </Card>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-sm text-gray-600 mt-8">
          <p className="font-semibold text-gray-800 mb-1">Note d'information</p>
          <p>Ces mentions légales peuvent être mises à jour à tout moment. La date de la dernière mise à jour figure dans l'en-tête de ce document. Nous vous invitons à consulter régulièrement cette page.</p>
        </div>
      </section>
    </article>
  )
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
