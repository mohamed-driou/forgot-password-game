const fs = require('fs');
const path = require('path');

const firebaseConfig = `const firebaseConfig = {
  apiKey: "${process.env.FIREBASE_API_KEY}",
  authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.FIREBASE_APP_ID}"
};`;

const authJsPath = path.join(__dirname, 'js', 'auth.js');
const authJsContent = fs.readFileSync(authJsPath, 'utf8');
const updatedAuthJs = authJsContent.replace(/const firebaseConfig = \{[\s\S]*?\};/, firebaseConfig);

fs.writeFileSync(authJsPath, updatedAuthJs);