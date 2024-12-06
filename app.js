import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyD5P-J61go84DIzOxvJIiszdvqnn97dIWw",
  authDomain: "firstproject-a90f6.firebaseapp.com",
  projectId: "firstproject-a90f6",
  storageBucket: "firstproject-a90f6.firebasestorage.app",
  messagingSenderId: "520651319637",
  appId: "1:520651319637:web:3d0a2b404b201b840ba7dc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function signup(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) return alert("Please fill out all fields.");
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Sign up successful!");
      window.location.href = "./index.html";
    })
    .catch((error) => alert("Error: " + error.message));
}

document.getElementById("signupButton")?.addEventListener("click", signup);

function signin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill out both email and password fields.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in successfully: ", user);
      alert("Logged in...");
      sessionStorage.setItem("user", user.accessToken);
      window.location.href = "./welcome.html";
    })
    .catch((error) => {
      console.error("Error signing in:", error.code, error.message);
      alert("Error: " + error.message);
    });
}

document.getElementById("loginButton")?.addEventListener("click", signin);

function signinWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      sessionStorage.setItem("user", result.user.uid);
      alert("Signed in successfully!");
      window.location.href = "./welcome.html";
    })
    .catch((error) => alert("Error: " + error.message));
}

document.getElementById("googleButton")?.addEventListener("click", signinWithGoogle);

function submitFormToDb() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  addDoc(collection(db, "user info"), {
    name: name,
    email: email,
    date: Timestamp.now(),
  })
    .then((docRef) => {
      console.log("Form Submitted: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

const submitForm = document.getElementById("signupButton");
submitForm?.addEventListener("click", submitFormToDb);

// Fetch Form Data from Firestore
async function getFormData() {
  const dataElement = document.getElementById("data");
  try {
    const querySnapshot = await getDocs(collection(db, "user info"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    dataElement.innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getFormData();