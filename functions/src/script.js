// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAxg12BSNjWR5MHE_zMW9eEDGigvSVTxCo",
    authDomain: "fracta-01.firebaseapp.com",
    projectId: "fracta-01",
    storageBucket: "fracta-01.firebasestorage.app",
    messagingSenderId: "582820039190",
    appId: "1:582820039190:web:f1d80d2fade22d38b8c337",
    measurementId: "G-SES8WDYVLN"
  };
  
const app = window.firebase.initializeApp(firebaseConfig);
const db = window.firebase.firestore(app);


  console.log('Before loadScripts');

// Function to fetch scripts and update the HTML from firestore collection 'scripts'
async function loadScripts() {
  const scriptsContainer = document.getElementById('scripts-container');
  if (!scriptsContainer) {
    console.error("Error: Could not find element with ID 'scripts-container'");
    return;
  }

  try {
    const querySnapshot = await db.collection('scripts').get();
    if (querySnapshot.empty) {
      scriptsContainer.innerText = "No scripts found.";
      return;
    }

    // Clear previous content (optional)
    scriptsContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const scriptData = doc.data(); // No TypeScript interface/cast needed
      const title = scriptData.title ?? 'No Title'; // Provide default values
      const description = scriptData.description ?? 'No Description';
      const privateURL = scriptData.privateUrl ;

      // Create list item for the script
      const scriptItem = document.createElement('div');
      scriptItem.classList.add('script-item'); // Add a class for styling

      scriptItem.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        ${privateURL ? `<a href="${privateURL}" target="_blank" rel="noopener noreferrer">Descargar Script</a>` : '<p>No download link available</p>'}
      `; // Only show link if URL exists

      scriptsContainer.appendChild(scriptItem);
    });
  } catch (error) {
    console.error("Error getting scripts: ", error);
    scriptsContainer.innerText = "Error loading scripts.";
  }
}

console.log('After loadScripts');

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', loadScripts);
