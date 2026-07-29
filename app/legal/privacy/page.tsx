import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - TiiBnTick',
  description: 'Avis de confidentialité et protection des données personnelles TiiBnTick — Version Bêta 1.0',
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

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <div className="mb-10 pb-6 border-b border-orange-100">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Bêta publiée — Version 1.0 — 25 juillet 2026 — Code: TBT-LEGAL-PRIVACY-ENFR-1.0
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Politique de Confidentialité
        </h1>
        <p className="text-base text-gray-500 mb-1 italic">Privacy and Personal Data Protection Notice</p>
        <p className="text-gray-500 text-sm max-w-2xl">
          Avis transversal applicable aux utilisateurs, partenaires et intégrateurs TiiBnTick. Conforme à la loi camerounaise de 2024 sur la protection des données personnelles.
        </p>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>IMPORTANT</strong> — Ce document régit une version bêta publiée susceptible d&apos;évoluer. Il doit être lu avec les avis ou conditions spécifiques affichés dans un module, une commande, une offre, un contrat partenaire ou une intégration API.
        </div>
      </div>

      <div className="space-y-8">
        <Card title="1. Qui sommes-nous ?">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Le responsable du traitement de vos données est <strong>Yowyob Inc. Ltd</strong>, éditeur de la suite de plateformes TiiBnTick. Contact DPO : <a href="mailto:privacy@yowyob.com" className="text-orange-600 hover:underline">privacy@yowyob.com</a>.</p>
          </div>
        </Card>

        <Card title="2. Données collectées">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Selon votre usage des services TiiBnTick, nous collectons :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Données d&apos;identification :</strong> nom, prénom, numéro de téléphone, adresse e-mail.</li>
              <li><strong>Données d&apos;adresse :</strong> adresse physique, ville, région, pays.</li>
              <li><strong>Données de livraison :</strong> informations sur les colis, adresses d&apos;expédition et de destination, photos.</li>
              <li><strong>Données de paiement :</strong> références de transactions (aucune donnée bancaire brute n&apos;est stockée par TiiBnTick).</li>
              <li><strong>Données de géolocalisation :</strong> position GPS lors de l&apos;utilisation des fonctionnalités de livraison ou d&apos;expédition (avec votre consentement).</li>
              <li><strong>Données techniques :</strong> adresse IP, type de navigateur, données de navigation et de performance.</li>
              <li><strong>Photos :</strong> selfie de profil, photo de pièce d&apos;identité (pour les livreurs Go), photos de colis.</li>
            </ul>
          </div>
        </Card>

        <Card title="3. Finalités du traitement">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Création et gestion de votre compte utilisateur.</li>
              <li>Traitement et suivi des expéditions et livraisons.</li>
              <li>Mise en relation entre expéditeurs et livreurs.</li>
              <li>Gestion des paiements et facturation.</li>
              <li>Amélioration de nos services et de l&apos;expérience utilisateur.</li>
              <li>Communications opérationnelles (notifications de livraison, alertes).</li>
              <li>Respect de nos obligations légales et réglementaires.</li>
              <li>Prévention de la fraude et sécurité des services.</li>
            </ul>
          </div>
        </Card>

        <Card title="4. Base légale du traitement">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Selon les cas, le traitement de vos données repose sur :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>L&apos;exécution du contrat de service (utilisation des plateformes TiiBnTick).</li>
              <li>Votre consentement explicite (géolocalisation, cookies non essentiels).</li>
              <li>Nos obligations légales (loi camerounaise sur la protection des données 2024).</li>
              <li>Notre intérêt légitime (amélioration des services, prévention de la fraude).</li>
            </ul>
          </div>
        </Card>

        <Card title="5. Partage de vos données">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Vos données peuvent être partagées avec :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Les livreurs Go :</strong> informations nécessaires à l&apos;exécution de la livraison (nom, téléphone, adresse de livraison).</li>
              <li><strong>Les agences partenaires :</strong> dans le cadre de la gestion des colis.</li>
              <li><strong>Les prestataires de paiement :</strong> pour le traitement sécurisé des transactions.</li>
              <li><strong>Les autorités compétentes :</strong> sur réquisition judiciaire ou administrative.</li>
            </ul>
            <p>Nous ne vendons pas vos données personnelles à des tiers.</p>
          </div>
        </Card>

        <Card title="6. Conservation des données">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Vos données sont conservées pendant la durée nécessaire à la fourniture des services et, le cas échéant, pendant la durée légale de prescription applicable. Les données de compte inactif sont supprimées après 24 mois d&apos;inactivité.</p>
          </div>
        </Card>

        <Card title="7. Vos droits">
          <div className="text-sm text-gray-600 space-y-3">
            <p>Conformément à la loi camerounaise de 2024 sur la protection des données, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données personnelles.</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes.</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données.</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré.</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer à certains traitements.</li>
              <li><strong>Droit au retrait du consentement :</strong> à tout moment pour les traitements basés sur votre consentement.</li>
            </ul>
            <p>Pour exercer vos droits : <a href="mailto:privacy@yowyob.com" className="text-orange-600 hover:underline">privacy@yowyob.com</a></p>
          </div>
        </Card>

        <Card title="8. Sécurité des données">
          <div className="text-sm text-gray-600 space-y-2">
            <p>TiiBnTick met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction (chiffrement des données, accès restreint, journaux d&apos;audit, etc.).</p>
          </div>
        </Card>

        <Card title="9. Transferts internationaux de données">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Vos données peuvent être transférées et traitées dans des pays autres que votre pays de résidence. Dans ce cas, nous assurons que les transferts sont effectués dans le respect des garanties appropriées conformément à la réglementation applicable.</p>
          </div>
        </Card>

        <Card title="10. Contact et réclamations">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Pour toute question relative à notre politique de confidentialité : <a href="mailto:privacy@yowyob.com" className="text-orange-600 hover:underline">privacy@yowyob.com</a>.</p>
            <p>Vous disposez également du droit de déposer une réclamation auprès de l&apos;autorité de contrôle compétente en matière de protection des données au Cameroun.</p>
          </div>
        </Card>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">Réseaux sociaux Yowyob / TiiBnTick</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a href="https://www.facebook.com/YowyobInc" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Facebook</a>
            <a href="https://twitter.com/yowyob" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Twitter / X</a>
            <a href="https://www.instagram.com/yowyob" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Instagram</a>
          </div>
        </div>
      </div>
    </article>
  )
}
