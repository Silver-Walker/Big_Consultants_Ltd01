/* =========================================
   ADMIN DASHBOARD SCRIPT — Big Consultants Ltd
   ========================================= */

/* ====== 1. Firebase Config ====== */
// Same config as script.js — must match exactly
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ====== DOM Elements ====== */
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginFeedback = document.getElementById('login-feedback');
const logoutBtn = document.getElementById('logout-btn');

const submissionsList = document.getElementById('submissions-list');
const projectForm = document.getElementById('project-form');
const projectsList = document.getElementById('projects-list');

/* ====== 2. Auth State Listener ====== */
auth.onAuthStateChanged(user => {
  if (user) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    fetchMessages();
    fetchProjects();
  } else {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
  }
});

/* ====== 3. Login ====== */
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      loginFeedback.textContent = err.message;
      loginFeedback.style.color = 'red';
    });
});

/* ====== 4. Logout ====== */
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

/* ====== 5. Fetch Contact Messages ====== */
function fetchMessages() {
  db.collection("contactMessages").orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      submissionsList.innerHTML = '';
      snapshot.forEach(doc => {
        const msg = doc.data();
        const card = document.createElement('div');
        card.classList.add('admin-card');
        card.innerHTML = `
          <p><strong>${msg.name}</strong> — ${msg.email}</p>
          <p>${msg.message}</p>
          <button class="btn small delete-message" data-id="${doc.id}">Delete</button>
        `;
        submissionsList.appendChild(card);
      });

      document.querySelectorAll('.delete-message').forEach(btn => {
        btn.addEventListener('click', () => deleteMessage(btn.dataset.id));
      });
    });
}

/* ====== 6. Delete Contact Message ====== */
function deleteMessage(id) {
  db.collection("contactMessages").doc(id).delete().catch(err => {
    console.error("Error deleting message:", err);
  });
}

/* ====== 7. Add Project ====== */
projectForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('project-title').value.trim();
  const desc = document.getElementById('project-desc').value.trim();
  const category = document.getElementById('project-category').value.trim();
  const media = document.getElementById('project-media').value.trim();

  db.collection("projects").add({
    title,
    desc,
    category,
    media,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    projectForm.reset();
  })
  .catch(err => console.error("Error adding project:", err));
});

/* ====== 8. Fetch Projects ====== */
function fetchProjects() {
  db.collection("projects").orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      projectsList.innerHTML = '';
      snapshot.forEach(doc => {
        const proj = doc.data();
        const card = document.createElement('div');
        card.classList.add('admin-card');
        card.innerHTML = `
          <h4>${proj.title}</h4>
          <p>${proj.desc}</p>
          <p><em>${proj.category}</em></p>
          <a href="${proj.media}" target="_blank">View Media</a>
          <br>
          <button class="btn small delete-project" data-id="${doc.id}">Delete</button>
        `;
        projectsList.appendChild(card);
      });

      document.querySelectorAll('.delete-project').forEach(btn => {
        btn.addEventListener('click', () => deleteProject(btn.dataset.id));
      });
    });
}

/* ====== 9. Delete Project ====== */
function deleteProject(id) {
  db.collection("projects").doc(id).delete().catch(err => {
    console.error("Error deleting project:", err);
  });
}

/* ====== 10. Auto Year ====== */
document.getElementById('year').textContent = new Date().getFullYear();
