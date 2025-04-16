// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxg12BSNjWR5MHE_zMW9eEDGigvSVTxCo",
  authDomain: "fracta-01.firebaseapp.com",
  projectId: "fracta-01",
  storageBucket: "fracta-01.firebasestorage.app",
  messagingSenderId: "582820039190",
  appId: "1:582820039190:web:f1d80d2fade22d38b8c337",
  measurementId: "G-SES8WDYVLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app);
const db = getFirestore(app);
console.log("Firestore database initialized:", db);

async function loadScripts() {
  const scriptsContainer = document.getElementById('scripts-container');
  if (!scriptsContainer) {
     console.error("Error: Could not find element with ID 'scripts-container'");
     scriptsContainer.innerText = `Error: Could not find element with ID 'scripts-container'`; 

    return;
  }
  try {
    const scriptsCollectionRef = collection(db, 'script');
    const querySnapshot = await getDocs(scriptsCollectionRef);
    if (querySnapshot.empty) {
      scriptsContainer.innerText = "No scripts found.";        
      return;
    }

    scriptsContainer.innerHTML = ''; // Limpia el contenedor

    querySnapshot.forEach((doc) => {
      // doc.id es el ID del documento, doc.data() es la información
      const scriptData = doc.data();        
      const title = scriptData.title ?? 'No Title';        
      const description = scriptData.description ?? 'No Description'
      const privateURL = scriptData.privateUrl;

      const scriptItem = document.createElement('div');
      scriptItem.classList.add('script-item');

      scriptItem.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
         ${privateURL ? `<a href="${privateURL}" target="_blank" rel="noopener noreferrer">Descargar Script</a>` : '<p>No download link available</p>'}
      `;

      scriptsContainer.appendChild(scriptItem);
    });
  } catch (error) {
    console.error("Error getting scripts: ", error.code, error.message, error);
    scriptsContainer.innerText = `Error loading scripts: ${error.message || error}`;
  }
}
document.addEventListener('DOMContentLoaded', loadScripts);