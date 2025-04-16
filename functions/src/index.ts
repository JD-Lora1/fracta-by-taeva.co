import * as v2 from 'firebase-functions/v2';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Script {
  title: string;
  description: string;
  downloadUrl: string;
}

const scriptsContainer = document.getElementById('scripts-container') as HTMLDivElement;

getDocs(collection(db, 'scripts'))
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const scriptData = doc.data() as Script;
      const title = scriptData.title;
      const description = scriptData.description;
      const downloadURL = scriptData.downloadUrl;

      const scriptItem = document.createElement('div');
      scriptItem.classList.add('script-item');
      scriptItem.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="${downloadURL}" target="_blank" rel="noopener noreferrer">Descargar Script</a>
      `;
      scriptsContainer.appendChild(scriptItem);
    });
  })
  .catch((error) => {
    console.error("Error al obtener los scripts:", error);
    scriptsContainer.innerText = "Error al cargar los scripts.";
  });