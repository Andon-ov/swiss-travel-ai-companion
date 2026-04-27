import * as admin from 'firebase-admin';
import { SPOTS } from '../apps/mobile/constants/spots';

// You need to download your service account key from Firebase Console
// and place it in the root directory as 'serviceAccountKey.json'
// or set the GOOGLE_APPLICATION_CREDENTIALS environment variable.

if (process.env.GOOGLE_APPLICATION_CREDENTIALS || require('fs').existsSync('./serviceAccountKey.json')) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

  const db = admin.firestore();

  async function seed() {
    console.log('Seeding spots...');
    const batch = db.batch();

    SPOTS.forEach((spot) => {
      const docRef = db.collection('spots').doc(spot.id);
      batch.set(docRef, spot);
    });

    await batch.commit();
    console.log('Seeding complete!');
  }

  seed().catch(console.error);
} else {
  console.error('Please provide service account credentials to run this script.');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts.');
  console.log('2. Click "Generate new private key".');
  console.log('3. Save it as "serviceAccountKey.json" in the project root.');
}
