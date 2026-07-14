import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.transaction.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.user.deleteMany()

  // Create a livreur (delivery person) user
  const livreur = await prisma.user.create({
    data: {
      email: 'livreur@tiibntick.com',
      password: 'password123',
      firstName: 'Moussa',
      lastName: 'Diallo',
      phone: '+237 6XX XXX XXX',
      userType: 'LIVREUR',
      isActive: true,
      rating: 4.8,
      totalDeliveries: 47,
      memberSince: new Date('2024-06-15'),
      city: 'Douala',
      commercialName: 'Express Douala',
      wallet: {
        create: {
          balance: 38500,
          totalEarnings: 285000,
          pendingAmount: 12500,
          lastMonth: 67000,
          transactions: {
            create: [
              { type: 'GAIN', amount: 2500, description: 'Livraison Colis - Kouassi M.', status: 'COMPLETED', createdAt: new Date('2025-01-27T09:45:00') },
              { type: 'GAIN', amount: 1800, description: 'Documents urgents - Diop A.', status: 'COMPLETED', createdAt: new Date('2025-01-27T08:30:00') },
              { type: 'GAIN', amount: 3200, description: 'Livraison repas - Yao E.', status: 'COMPLETED', createdAt: new Date('2025-01-26T19:20:00') },
              { type: 'RETRAIT', amount: 20000, description: 'Retrait Mobile Money', status: 'COMPLETED', createdAt: new Date('2025-01-26T18:00:00') },
              { type: 'GAIN', amount: 1000, description: 'Pharmacie - Koffi A.', status: 'COMPLETED', createdAt: new Date('2025-01-26T17:45:00') },
              { type: 'GAIN', amount: 2000, description: 'Colis express - Amani Y.', status: 'COMPLETED', createdAt: new Date('2025-01-26T15:30:00') },
              { type: 'GAIN', amount: 3000, description: 'Courses urgentes - Kouame P.', status: 'COMPLETED', createdAt: new Date('2025-01-26T12:15:00') },
              { type: 'GAIN', amount: 1500, description: 'Repas à domicile - Touré A.', status: 'COMPLETED', createdAt: new Date('2025-01-25T10:50:00') },
              { type: 'GAIN', amount: 2200, description: 'Documents - Koné I.', status: 'COMPLETED', createdAt: new Date('2025-01-25T18:20:00') },
              { type: 'RETRAIT', amount: 15000, description: 'Retrait virement bancaire', status: 'COMPLETED', createdAt: new Date('2025-01-25T16:00:00') },
              { type: 'GAIN', amount: 1400, description: 'Pharmacie & Santé - Diallo F.', status: 'COMPLETED', createdAt: new Date('2025-01-25T14:10:00') },
              { type: 'GAIN', amount: 1700, description: 'Documents urgents - Bakayoko S.', status: 'COMPLETED', createdAt: new Date('2025-01-24T11:30:00') },
              { type: 'GAIN', amount: 4500, description: 'Livraison premium - Ngassa J.', status: 'PENDING', createdAt: new Date('2025-01-28T08:00:00') },
              { type: 'GAIN', amount: 3500, description: 'Course alimentaire - Fotso L.', status: 'PENDING', createdAt: new Date('2025-01-28T07:30:00') },
              { type: 'GAIN', amount: 4500, description: 'Livraison fragile - Tchinda R.', status: 'PENDING', createdAt: new Date('2025-01-28T09:15:00') },
            ]
          }
        }
      }
    }
  })

  // Create a client user
  const client = await prisma.user.create({
    data: {
      email: 'client@tiibntick.com',
      password: 'password123',
      firstName: 'Kouassi',
      lastName: 'Mariam',
      phone: '+237 6YY YYY YYY',
      userType: 'CLIENT',
      isActive: true,
      city: 'Douala',
      wallet: {
        create: {
          balance: 50000,
          totalEarnings: 0,
          pendingAmount: 0,
          lastMonth: 0,
        }
      }
    }
  })

  // Create some published announcements
  const announcements = [
    {
      clientId: client.id,
      title: 'Livraison Colis Douala - Bonapriso',
      description: 'Colis moyen contenant des vêtements à livrer de Bonapriso à Makepé',
      status: 'PUBLISHED',
      amount: 2500,
      recipientFirstName: 'Aminata',
      recipientLastName: 'Touré',
      recipientEmail: 'aminata@email.com',
      recipientPhone: '+237 611 222 333',
      shipperFirstName: 'Kouassi',
      shipperLastName: 'Mariam',
      shipperEmail: 'client@tiibntick.com',
      shipperPhone: '+237 6YY YYY YYY',
      pickupAddress: JSON.stringify({ street: 'Rue Joss', city: 'Douala', district: 'Bonapriso', country: 'Cameroun', description: 'Devant le Supermarché', type: 'HOME', latitude: 4.0511, longitude: 9.7679 }),
      deliveryAddress: JSON.stringify({ street: 'Avenue de la Liberté', city: 'Douala', district: 'Makepé', country: 'Cameroun', description: 'Résidence Les Palmiers, Porte B', type: 'HOME', latitude: 4.0176, longitude: 9.7932 }),
      packet: JSON.stringify({ width: 30, length: 40, fragile: false, description: 'Carton de vêtements', photoPacket: '', isPerishable: false, thickness: 20, designation: 'Vêtements' }),
      distance: 8.5,
      duration: 25,
      transportMethod: 'driving',
      paymentMethod: 'CASH',
    },
    {
      clientId: client.id,
      title: 'Documents urgents Plateau - Akwa',
      description: 'Enveloppe contenant des documents légaux à remettre en main propre',
      status: 'PUBLISHED',
      amount: 1500,
      recipientFirstName: 'Ibrahim',
      recipientLastName: 'Koné',
      recipientEmail: 'ibrahim@email.com',
      recipientPhone: '+237 622 333 444',
      shipperFirstName: 'Kouassi',
      shipperLastName: 'Mariam',
      shipperEmail: 'client@tiibntick.com',
      shipperPhone: '+237 6YY YYY YYY',
      pickupAddress: JSON.stringify({ street: 'Avenue de la République', city: 'Douala', district: 'Plateau', country: 'Cameroun', description: 'Immeuble CBC, 3ème étage', type: 'OFFICE', latitude: 4.0483, longitude: 9.7043 }),
      deliveryAddress: JSON.stringify({ street: 'Rue Joseph Aumuatte', city: 'Douala', district: 'Akwa', country: 'Cameroun', description: 'Bureau de notaire, 1er étage', type: 'OFFICE', latitude: 4.0536, longitude: 9.6954 }),
      packet: JSON.stringify({ width: 5, length: 35, fragile: false, description: 'Enveloppe kraft A4', photoPacket: '', isPerishable: false, thickness: 2, designation: 'Documents' }),
      distance: 3.2,
      duration: 12,
      transportMethod: 'bike',
      paymentMethod: 'MOBILE_MONEY',
    },
    {
      clientId: client.id,
      title: 'Repas à domicile Deido - Bépanda',
      description: 'Commande de plats camerounais à livrer chauds',
      status: 'PUBLISHED',
      amount: 1800,
      recipientFirstName: 'Fatou',
      recipientLastName: 'Diallo',
      recipientEmail: 'fatou@email.com',
      recipientPhone: '+237 633 444 555',
      shipperFirstName: 'Kouassi',
      shipperLastName: 'Mariam',
      shipperEmail: 'client@tiibntick.com',
      shipperPhone: '+237 6YY YYY YYY',
      pickupAddress: JSON.stringify({ street: 'Rue de la Gastronomie', city: 'Douala', district: 'Deido', country: 'Cameroun', description: 'Restaurant Le Baobab', type: 'RESTAURANT', latitude: 4.0528, longitude: 9.7316 }),
      deliveryAddress: JSON.stringify({ street: 'Boulevard de Bépanda', city: 'Douala', district: 'Bépanda', country: 'Cameroun', description: 'Carrefour Bépanda, près de la station Total', type: 'HOME', latitude: 4.0354, longitude: 9.7442 }),
      packet: JSON.stringify({ width: 25, length: 25, fragile: true, description: 'Sac isotherme avec plats', photoPacket: '', isPerishable: true, thickness: 15, designation: 'Repas' }),
      distance: 5.1,
      duration: 18,
      transportMethod: 'bike',
      paymentMethod: 'CASH',
    },
    {
      clientId: client.id,
      title: 'Courses alimentaires Marché Central',
      description: 'Plusieurs sacs de courses à rapporter du marché central',
      status: 'PUBLISHED',
      amount: 3000,
      recipientFirstName: 'Paul',
      recipientLastName: 'Kouamé',
      recipientEmail: 'paul@email.com',
      recipientPhone: '+237 644 555 666',
      shipperFirstName: 'Kouassi',
      shipperLastName: 'Mariam',
      shipperEmail: 'client@tiibntick.com',
      shipperPhone: '+237 6YY YYY YYY',
      pickupAddress: JSON.stringify({ street: 'Rue du Marché', city: 'Douala', district: 'Nkouloulounkoul', country: 'Cameroun', description: 'Entrée principale du Marché Central', type: 'MARKET', latitude: 4.0493, longitude: 9.7089 }),
      deliveryAddress: JSON.stringify({ street: 'Avenue Charles De Gaulle', city: 'Douala', district: 'Bonanjo', country: 'Cameroun', description: 'Villa bleue avec portail blanc', type: 'HOME', latitude: 4.0567, longitude: 9.7234 }),
      packet: JSON.stringify({ width: 40, length: 50, fragile: false, description: '4 sacs de courses', photoPacket: '', isPerishable: true, thickness: 30, designation: 'Courses' }),
      distance: 4.7,
      duration: 15,
      transportMethod: 'driving',
      paymentMethod: 'CASH',
    },
    {
      clientId: client.id,
      title: 'Colis fragile - Électronique',
      description: 'Appareil électronique emballé avec précaution, manipulation délicate requise',
      status: 'PUBLISHED',
      amount: 4500,
      recipientFirstName: 'Jean',
      recipientLastName: 'Ngassa',
      recipientEmail: 'jean@email.com',
      recipientPhone: '+237 655 666 777',
      shipperFirstName: 'Kouassi',
      shipperLastName: 'Mariam',
      shipperEmail: 'client@tiibntick.com',
      shipperPhone: '+237 6YY YYY YYY',
      pickupAddress: JSON.stringify({ street: 'Boulevard de la Liberté', city: 'Douala', district: 'Akwa Nord', country: 'Cameroun', description: 'Magasin Electronix, entrée côté parking', type: 'SHOP', latitude: 4.0575, longitude: 9.6991 }),
      deliveryAddress: JSON.stringify({ street: 'Rue des Flandres', city: 'Douala', district: 'Bassa', country: 'Cameroun', description: 'Immeuble Horizon, Appartement 4B', type: 'HOME', latitude: 4.0289, longitude: 9.7156 }),
      packet: JSON.stringify({ width: 50, length: 40, fragile: true, description: 'Écran plat dans emballage d\'origine', photoPacket: '', isPerishable: false, thickness: 10, designation: 'Électronique' }),
      distance: 6.3,
      duration: 22,
      transportMethod: 'driving',
      paymentMethod: 'MOBILE_MONEY',
    }
  ]

  for (const ann of announcements) {
    await prisma.announcement.create({ data: ann })
  }

  // Create one already-assigned announcement
  const assignedAnn = await prisma.announcement.create({
    data: {
      clientId: client.id,
      title: 'Livraison médicale urgente',
      description: 'Médicaments à livrer en urgence à une clinique',
      status: 'ASSIGNED',
      amount: 2000,
      recipientFirstName: 'Dr.',
      recipientLastName: 'Tchinda',
      recipientEmail: 'tchinda@clinique.com',
      recipientPhone: '+237 666 777 888',
      shipperFirstName: 'Kouassi',
      shipperLastName: 'Mariam',
      shipperEmail: 'client@tiibntick.com',
      shipperPhone: '+237 6YY YYY YYY',
      pickupAddress: JSON.stringify({ street: 'Rue de la Pharmacie', city: 'Douala', district: 'New Bell', country: 'Cameroun', description: 'Pharmacie Centrale', type: 'PHARMACY', latitude: 4.0385, longitude: 9.7155 }),
      deliveryAddress: JSON.stringify({ street: 'Avenue du General', city: 'Douala', district: 'Bonabéri', country: 'Cameroun', description: 'Clinique Espoir', type: 'HOSPITAL', latitude: 4.0726, longitude: 9.6952 }),
      packet: JSON.stringify({ width: 15, length: 25, fragile: true, description: 'Médicaments sous plastique', photoPacket: '', isPerishable: false, thickness: 10, designation: 'Médicaments' }),
      distance: 9.1,
      duration: 30,
      transportMethod: 'driving',
      paymentMethod: 'CASH',
      assignedDeliveryPersonId: livreur.id,
    }
  })

  // Create subscription for the assigned announcement
  await prisma.subscription.create({
    data: {
      announcementId: assignedAnn.id,
      deliveryPersonId: livreur.id,
      status: 'ACCEPTED',
    }
  })

  console.log('✅ Seed completed!')
  console.log(`  Livreur: ${livreur.firstName} ${livreur.lastName} (${livreur.id})`)
  console.log(`  Client: ${client.firstName} ${client.lastName} (${client.id})`)
  console.log(`  Announcements: ${announcements.length + 1} (5 published, 1 assigned)`)
  console.log(`  Wallet balance: ${38500} FCFA`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())