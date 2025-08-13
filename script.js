/* =========================================
   PUBLIC SITE SCRIPT — Big Consultants Ltd
   ========================================= */

/* ====== 1. Firebase Config ====== */
// Replace with your Firebase project configuration
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
const db = firebase.firestore();

/* ====== 2. Navigation Menu Toggle ====== */
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

/* ====== 3. Tabs for Projects ====== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Deactivate all buttons & panels
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.projects-panel').forEach(p => p.classList.remove('active'));

    // Activate selected
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

/* ====== 4. Media Modal Viewer ====== */
const modal = document.createElement('div');
modal.classList.add('media-modal');
modal.innerHTML = `
  <div class="modal-inner">
    <button class="modal-close" aria-label="Close">✕</button>
    <div class="media-content"></div>
  </div>
`;
document.body.appendChild(modal);

document.querySelectorAll('.view-media').forEach(btn => {
  btn.addEventListener('click', () => {
    const mediaUrl = btn.dataset.video;
    const contentDiv = modal.querySelector('.media-content');

    contentDiv.innerHTML = ''; // Clear previous content
    if (mediaUrl.endsWith('.mp4')) {
      contentDiv.innerHTML = `<video src="${mediaUrl}" controls></video>`;
    } else if (mediaUrl.includes('youtube')) {
      contentDiv.innerHTML = `<iframe src="${mediaUrl}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      contentDiv.innerHTML = `<img src="${mediaUrl}" alt="Media content" />`;
    }

    modal.classList.add('active');
  });
});

modal.querySelector('.modal-close').addEventListener('click', () => {
  modal.classList.remove('active');
  modal.querySelector('.media-content').innerHTML = '';
});

/* ====== 5. Contact Form Submission ====== */
const contactForm = document.getElementById('contact-form');
const feedbackEl = document.getElementById('contact-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      feedbackEl.textContent = "Please fill in all fields.";
      feedbackEl.style.color = "red";
      return;
    }

    try {
      await db.collection("contactMessages").add({
        name,
        email,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      feedbackEl.textContent = "Message sent successfully!";
      feedbackEl.style.color = "green";
      contactForm.reset();
    } catch (err) {
      console.error("Error saving message:", err);
      feedbackEl.textContent = "Error sending message. Please try again.";
      feedbackEl.style.color = "red";
    }
  });
}

/* ====== 6. Auto Year in Footer ====== */
document.getElementById('year').textContent = new Date().getFullYear();
