import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - TiiBnTick',
  description: 'Conditions Générales d\'Utilisation et de Services TiiBnTick — Version Bêta 1.0',
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  )
}

export default function CguPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <div className="mb-10 pb-6 border-b border-orange-100">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Bêta publiée — Version 1.0 — 25 juillet 2026 — Code: TBT-LEGAL-TOU-ENFR-1.0
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Conditions Générales d&apos;Utilisation et de Services
        </h1>
        <p className="text-base text-gray-500 mb-1"><span className="italic">Terms of Use and Services</span></p>
        <p className="text-gray-500 text-sm max-w-2xl">
          Conditions transversales applicables à l&apos;ensemble de l&apos;écosystème TiiBnTick — Un système Yowyob.
        </p>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>IMPORTANT</strong> — Ce document régit une version bêta publiée susceptible d&apos;évoluer. Il doit être lu avec les avis ou conditions spécifiques affichés dans un module, une commande, une offre, un contrat partenaire ou une intégration API.
        </div>
      </div>

      <div className="space-y-8">
        <Card title="1. Objet et champ d'application">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Les présentes Conditions Générales d&apos;Utilisation et de Services (&laquo; CGU &raquo;) définissent les droits et obligations de Yowyob Inc. Ltd (&laquo; TiiBnTick &raquo;, &laquo; nous &raquo;) et des utilisateurs (&laquo; vous &raquo;, &laquo; l&apos;utilisateur &raquo;) dans le cadre de l&apos;utilisation des plateformes, applications et services TiiBnTick.</p>
            <p>En accédant à nos services, vous acceptez sans réserve les présentes CGU. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.</p>
            <p>TiiBnTick est une plateforme logistique connectée permettant l&apos;envoi, le suivi et la réception de colis, opérant actuellement en phase bêta publiée en Afrique centrale.</p>
          </div>
        </Card>

        <Card title="2. Descriptions des services">
          <div className="text-sm text-gray-600 space-y-3">
            <Section title="2.1 TiiBnTick Link">
              <p>Portail public permettant la création d&apos;envois de colis, le suivi en temps réel et les interactions destinataires. Accessible à l&apos;adresse <a href="https://tiibntick.yowyob.com/en" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">tiibntick.yowyob.com</a>.</p>
            </Section>
            <Section title="2.2 TiiBnTick Go">
              <p>Place de marché des opportunités de livraison pour les livreurs indépendants (&laquo; Go &raquo;). Accessible à l&apos;adresse <a href="https://tiibntick-go.yowyob.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">tiibntick-go.yowyob.com</a>.</p>
            </Section>
            <Section title="2.3 TiiBnTick Agency">
              <p>Tableau de bord destiné aux agences et partenaires professionnels de livraison. Accessible à <a href="https://tiibntick-agency.yowyob.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">tiibntick-agency.yowyob.com</a>.</p>
            </Section>
            <Section title="2.4 TiiBnTick Market">
              <p>Module de commerce et de promotions. Accessible à <a href="https://tiibntick-market.yowyob.com/en" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">tiibntick-market.yowyob.com</a>.</p>
            </Section>
            <Section title="2.5 TiiBnTick Point">
              <p>Réseau de relais, dépôts et points de service. Accessible à <a href="https://tiibntick-point.yowyob.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">tiibntick-point.yowyob.com</a>.</p>
            </Section>
          </div>
        </Card>

        <Card title="3. Inscription et compte utilisateur">
          <div className="text-sm text-gray-600 space-y-3">
            <p>L&apos;accès à certains services nécessite la création d&apos;un compte. Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription.</p>
            <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion. Toute utilisation de votre compte est réputée être faite par vous. Vous devez nous notifier immédiatement en cas d&apos;utilisation non autorisée de votre compte.</p>
            <p>TiiBnTick se réserve le droit de suspendre ou de résilier tout compte en cas de violation des présentes CGU, d&apos;activité frauduleuse ou de comportement abusif.</p>
          </div>
        </Card>

        <Card title="4. Obligations des utilisateurs">
          <div className="text-sm text-gray-600 space-y-3">
            <p>En utilisant nos services, vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Ne pas envoyer de colis contenant des substances illicites, des matières dangereuses non déclarées, ou tout objet prohibé par la loi camerounaise ou internationale.</li>
              <li>Déclarer la valeur réelle et le contenu exact de tout colis expédié.</li>
              <li>Respecter les droits de tiers et ne pas utiliser nos services à des fins frauduleuses ou illégales.</li>
              <li>Ne pas tenter d&apos;accéder sans autorisation à des systèmes ou données TiiBnTick.</li>
              <li>Respecter les autres utilisateurs et les livreurs partenaires.</li>
            </ul>
          </div>
        </Card>

        <Card title="5. Responsabilités de TiiBnTick">
          <div className="text-sm text-gray-600 space-y-3">
            <p>TiiBnTick met tout en œuvre pour assurer la disponibilité et la qualité de ses services, mais ne peut garantir une disponibilité permanente et sans interruption, notamment en phase bêta.</p>
            <p>TiiBnTick n&apos;est pas responsable des dommages indirects, pertes de profits ou pertes de données résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser nos services.</p>
            <p>En cas de perte ou dommage d&apos;un colis, la responsabilité de TiiBnTick est limitée à la valeur déclarée du colis, dans les limites fixées par les tarifs en vigueur.</p>
          </div>
        </Card>

        <Card title="6. Tarifs et paiements">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Les tarifs applicables aux services TiiBnTick sont affichés sur les plateformes au moment de la commande. Ils peuvent être modifiés sans préavis, sauf pour les commandes déjà confirmées.</p>
            <p>Les paiements s&apos;effectuent via les moyens de paiement acceptés par la plateforme (Mobile Money, carte bancaire, etc.). Toute transaction est sécurisée.</p>
            <p>Les prix sont exprimés en Franc CFA (XAF) et toutes taxes applicables comprises, sauf mention contraire.</p>
          </div>
        </Card>

        <Card title="7. Propriété intellectuelle">
          <div className="text-sm text-gray-600 space-y-3">
            <p>L&apos;ensemble des éléments constituant les plateformes TiiBnTick (marques, logos, textes, images, logiciels) sont la propriété exclusive de Yowyob Inc. Ltd et sont protégés par les lois relatives à la propriété intellectuelle.</p>
            <p>Toute reproduction, représentation, modification ou distribution sans autorisation préalable écrite de Yowyob Inc. Ltd est interdite.</p>
          </div>
        </Card>

        <Card title="8. Données personnelles">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Le traitement de vos données personnelles est régi par notre <a href="/legal/privacy" className="text-orange-600 hover:underline font-medium">Politique de Confidentialité</a>, document TBT-LEGAL-PRIVACY-ENFR-1.0, conforme à la loi camerounaise de 2024 sur la protection des données personnelles.</p>
          </div>
        </Card>

        <Card title="9. Modification des CGU">
          <div className="text-sm text-gray-600 space-y-2">
            <p>TiiBnTick se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés de toute modification substantielle. L&apos;utilisation continue des services après notification vaut acceptation des nouvelles conditions.</p>
          </div>
        </Card>

        <Card title="10. Droit applicable et litiges">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Les présentes CGU sont régies par le droit camerounais, notamment la loi n°2010/021 du 21 décembre 2010 régissant le commerce électronique au Cameroun.</p>
            <p>En cas de litige, les parties s&apos;engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut, les juridictions compétentes camerounaises seront saisies.</p>
            <p>Contact : <a href="mailto:legal@yowyob.com" className="text-orange-600 hover:underline">legal@yowyob.com</a></p>
          </div>
        </Card>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">Version et mises à jour</p>
          <p>Document TBT-LEGAL-TOU-ENFR-1.0 — Première version consolidée et augmentée couvrant toute la suite TiiBnTick. Statut : Bêta publiée. Date : 25 juillet 2026.</p>
        </div>
      </div>
    </article>
  )
}
