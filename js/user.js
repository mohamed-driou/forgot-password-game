import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from './auth.js';

// DOM Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const updateProfileForm = document.getElementById('updateProfileForm');
const logoutBtn = document.getElementById('logoutBtn');
const profileInfo = document.getElementById('profileInfo');

// Utility function for displaying errors
function showError(message, type = 'error') {
  const errorElement = document.getElementById('authError') || createErrorElement();
  errorElement.innerHTML = message;
  errorElement.style.display = 'block';
  errorElement.style.background = type === 'success' ? '#2ecc71' : '#e74c3c';
  setTimeout(() => errorElement.style.display = 'none', 5000);
}

function createErrorElement() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'authError';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    background: #e74c3c;
    color: white;
    border-radius: 5px;
    z-index: 1000;
    display: none;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  `;
  document.body.appendChild(errorDiv);
  return errorDiv;
}

// Password validation function
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('• At least 8 characters');
  }
  
  if (!/\d/.test(password)) {
    errors.push('• At least one number (0-9)');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('• At least one uppercase letter (A-Z)');
  }

  return errors;
}

// Password visibility toggle handler
function setupPasswordToggles() {
  // Register form toggle
  const registerToggle = document.getElementById('showRegisterPassword');
  const registerInput = document.getElementById('password');
  
  if (registerToggle && registerInput) {
    registerToggle.addEventListener('click', () => {
      const icon = registerToggle.querySelector('i');
      if (registerInput.type === 'password') {
        registerInput.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        registerInput.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
      registerInput.focus();
    });
  }

  // Login form toggle
  const loginToggle = document.getElementById('showLoginPassword');
  const loginInput = document.getElementById('password');
  
  if (loginToggle && loginInput) {
    loginToggle.addEventListener('click', () => {
      const icon = loginToggle.querySelector('i');
      if (loginInput.type === 'password') {
        loginInput.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        loginInput.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
      loginInput.focus();
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupPasswordToggles();
});

// Handle registration with password validation
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const displayName = document.getElementById('displayName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate password
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    showError(`<strong>Password requirements:</strong><br>${passwordErrors.join('<br>')}`);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    showError('Registration successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = '../index.html', 1500);
  } catch (error) {
    console.error('Registration error:', error);
    showError(getUserFriendlyError(error.code));
  }
});

// Handle login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showError('Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = '../index.html', 1500);
  } catch (error) {
    console.error('Login error:', error);
    showError(getUserFriendlyError(error.code));
  }
});

// Handle profile updates
updateProfileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const displayName = document.getElementById('displayName').value;
  const photoURL = document.getElementById('photoURL').value;

  try {
    await updateProfile(auth.currentUser, { displayName, photoURL });
    showError('Profile updated successfully!', 'success');
    loadProfile();
  } catch (error) {
    console.error('Profile update error:', error);
    showError(getUserFriendlyError(error.code));
  }
});

// Handle logout
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
    showError('Logging out...', 'success');
    setTimeout(() => window.location.href = '../auth/login.html', 1000);
  } catch (error) {
    console.error('Logout error:', error);
    showError('Failed to logout. Please try again.');
  }
});

// Enhanced profile loader
function loadProfile() {
  const user = auth.currentUser;
  if (user && profileInfo) {
    profileInfo.innerHTML = `
      <div class="profile-section">
        <h3>Profile Information</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Display Name:</strong> ${user.displayName || 'Not set'}</p>
        ${user.photoURL ? `
          <div class="profile-photo">
            <img src="${user.photoURL}" alt="Profile Photo">
          </div>
        ` : '<p>No profile photo set</p>'}
      </div>
    `;
  }
}

// Improved auth state handler
onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes('profile.html') && !user) {
    window.location.href = '../auth/login.html';
  } else if (user) {
    loadProfile();
    
    // Update welcome message on game page if exists
    const welcomeEl = document.getElementById('welcomeUser');
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome, ${user.displayName || user.email.split('@')[0]}!`;
    }
  }
});

// Convert Firebase error codes to user-friendly messages
function getUserFriendlyError(errorCode) {
  const errors = {
    'auth/email-already-in-use': 'Email already in use. Please use another email.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must meet the following requirements:<br>' +
                         '• At least 8 characters<br>' +
                         '• At least one number (0-9)<br>' +
                         '• At least one uppercase letter (A-Z)',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'default': 'An error occurred. Please try again.'
  };
  return errors[errorCode] || errors['default'];
}