const admin = require('firebase-admin');

const serviceAccount = require('./firebase.json'); // Update path to your Firebase admin SDK json
const dateToDeleteFrom = "2024-04-01T00:00:00Z";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${'your-project-id'}.firebaseio.com` // Update your project ID
});

const db = admin.firestore();

async function deleteEventsAfterDate() {
  const eventsRef = db.collection('Events');
  const snapshot = await eventsRef
    .where('date', '>=', new Date(dateToDeleteFrom))
    .get();

  if (snapshot.empty) {
    console.log('No matching documents to delete.');
    return;
  } 

  const batch = db.batch();

  snapshot.forEach(doc => {
    console.log(`Deleting document with ID: ${doc.id}`);
    const docRef = eventsRef.doc(doc.id);
    batch.delete(docRef);
  });

  await batch.commit();
  console.log('All matching documents have been deleted.');
}

deleteEventsAfterDate().catch(console.error);
