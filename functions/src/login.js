import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut // Importar signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Importa Analytics si lo necesitas
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxg12BSNjWR5MHE_zMW9eEDGigvSVTxCo",
  authDomain: "fracta-01.firebaseapp.com",
  projectId: "fracta-01",
  storageBucket: "fracta-01.firebasestorage.app",
  messagingSenderId: "582820039190",
  appId: "1:582820039190:web:f1d80d2fade22d38b8c337",
  measurementId: "G-SES8WDYVLN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Instancia de Firestore
const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app); // Descomenta si usas Analytics

const authContainer = document.getElementById('auth-container');
const loginFormArea = document.getElementById('login-form-area');
const userInfoArea = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const scriptsContainer = document.getElementById('scripts-container'); // Contenedor para scripts post-login

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');
const googleButton = document.getElementById('google-button');
const logoutButton = document.getElementById('logout-button');
const errorMessageElement = document.getElementById('error-message');

// --- Funciones de UI y Errores ---
function displayError(error) {
    console.error('Auth Error:', error);
    errorMessageElement.textContent = error.message || 'Ocurrió un error.';
}

function clearError() {
    errorMessageElement.textContent = '';
}

function showLoginForm() {
    loginFormArea.classList.remove('hidden');
    userInfoArea.classList.add('hidden');
}

function showUserInfo(user) {
    loginFormArea.classList.add('hidden');
    userInfoArea.classList.remove('hidden');
    userEmailSpan.textContent = user.email || user.displayName || 'Usuario'; // Muestra email o nombre
    // Llama a la función para cargar scripts aquí si es necesario
    loadScriptsIfNeeded(db);
}

// --- Funciones de Autenticación ---
async function handleSignup() {
    clearError();
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged se encargará de actualizar la UI
    } catch (error) {
        displayError(error);
    }
}

async function handleLogin() {
    clearError();
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged se encargará de actualizar la UI
    } catch (error) {
        displayError(error);
    }
}

async function handleGoogleLogin() {
    clearError();
    try {
        await signInWithPopup(auth, provider);
        // onAuthStateChanged se encargará de actualizar la UI
    } catch (error) {
        // Manejar errores específicos si es necesario
        if (error.code !== 'auth/popup-closed-by-user') {
           displayError(error);
        } else {
            console.log("Popup cerrado por el usuario");
        }
    }
}

async function handleLogout() {
    clearError();
    try {
        await signOut(auth);
        // onAuthStateChanged se encargará de actualizar la UI
        console.log("User signed out");
        // Limpia el contenedor de scripts al cerrar sesión
        if(scriptsContainer) scriptsContainer.innerHTML = '';
    } catch (error) {
        displayError(error);
    }
}

// --- Observador de Estado de Autenticación ---
onAuthStateChanged(auth, (user) => {
    clearError(); // Limpia errores al cambiar estado
    if (user) {
        console.log('User is signed in:', user.uid);
        showUserInfo(user);
    } else {
        console.log('User is signed out');
        showLoginForm();
         // Limpia el contenedor de scripts por si acaso
        if(scriptsContainer) scriptsContainer.innerHTML = '';
    }
});

// --- Añadir Event Listeners ---
// Asegurarse de que los elementos existen antes de añadir listeners
if (signupButton) signupButton.addEventListener('click', handleSignup);
if (loginButton) loginButton.addEventListener('click', handleLogin);
if (googleButton) googleButton.addEventListener('click', handleGoogleLogin);
if (logoutButton) logoutButton.addEventListener('click', handleLogout);

console.log("Auth script loaded and listeners potentially set.");


// --- Función para cargar scripts (Ejemplo de la pregunta anterior) ---
// Esta función se llamaría cuando el usuario inicie sesión
async function loadScriptsIfNeeded(dbInstance) {
    // Verifica si ya se cargaron o si el contenedor existe
    if (!scriptsContainer || scriptsContainer.dataset.loaded === 'true') {
        // console.log("Scripts ya cargados o contenedor no listo.");
        return;
    }
    console.log("Cargando scripts...");
    scriptsContainer.innerHTML = `<p>Cargando scripts...</p>`; // Mensaje de carga

    try {
        const scriptsCollectionRef = collection(dbInstance, 'script'); // Asegúrate que la colección se llama 'script'
        const querySnapshot = await getDocs(scriptsCollectionRef);

        if (querySnapshot.empty) {
            scriptsContainer.innerHTML = "<p>No hay scripts disponibles.</p>";
            scriptsContainer.dataset.loaded = 'true'; // Marcar como cargado (aunque vacío)
            return;
        }

        scriptsContainer.innerHTML = ''; // Limpiar mensaje de carga

        querySnapshot.forEach((doc) => {
            const scriptData = doc.data();
            const title = scriptData.title ?? 'No Title';
            const description = scriptData.description ?? 'No Description';
            const privateURL = scriptData.privateUrl; // Asegúrate que el campo se llama así en Firestore

            const scriptItem = document.createElement('div');
            scriptItem.classList.add('script-item');
            scriptItem.style.border = "1px solid #eee";
            scriptItem.style.marginBottom = "10px";
            scriptItem.style.padding = "10px";
            scriptItem.innerHTML = `
                <h4>${title}</h4>
                <p>${description}</p>
                ${privateURL ? `<a href="${privateURL}" target="_blank" rel="noopener noreferrer">Descargar Script</a>` : '<p><em>(No hay enlace de descarga)</em></p>'}
            `;
            scriptsContainer.appendChild(scriptItem);
        });
        scriptsContainer.dataset.loaded = 'true'; // Marcar como cargado exitosamente
    } catch (error) {
        console.error("Error getting scripts from Firestore: ", error);
        scriptsContainer.innerHTML = `<p style='color:red;'>Error al cargar scripts: ${error.message}</p>`;
        // No marcar como cargado si hubo error, para reintentar quizás
        // delete scriptsContainer.dataset.loaded;
    }
}