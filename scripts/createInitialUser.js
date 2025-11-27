#!/usr/bin/env node
/**
 * Create initial Firebase admin user using service account credentials
 * Usage: node scripts/createInitialUser.js
 * 
 * Requires either:
 * - FIREBASE_SERVICE_ACCOUNT_JSON env var with full JSON, OR
 * - Individual FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars, OR
 * - A serviceAccount.json file in the scripts/ directory
 * 
 * User details from env:
 * - INIT_USER_EMAIL (default: habib@kodexlabs.com)
 * - INIT_USER_PASSWORD (default: SmartOps@1234)
 * - INIT_USER_NAME (default: Habib Tech)
 * - INIT_USER_ROLE (default: Owner)
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Parse service account from env or file
function getServiceAccount() {
  // Try full JSON env var first
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
    }
  }

  // Try individual env vars
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  // Try file
  const filePath = path.join(__dirname, 'serviceAccount.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  throw new Error(
    'No service account found. Set FIREBASE_SERVICE_ACCOUNT_JSON env var, ' +
    'or FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY, ' +
    'or create scripts/serviceAccount.json'
  );
}

async function createUser() {
  try {
    const serviceAccount = getServiceAccount();
    
    // Initialize admin if not already done
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    const email = process.env.INIT_USER_EMAIL || 'habib@kodexlabs.com';
    const password = process.env.INIT_USER_PASSWORD || 'SmartOps@1234';
    const displayName = process.env.INIT_USER_NAME || 'Habib Tech';
    const role = process.env.INIT_USER_ROLE || 'Owner';

    console.log(`Creating user: ${email} (${displayName})`);

    let userRecord;
    try {
      // Try to get existing user
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('User already exists, updating...');
      
      // Update existing user
      userRecord = await admin.auth().updateUser(userRecord.uid, {
        password,
        displayName,
        emailVerified: true,
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName,
          emailVerified: true,
        });
        console.log('User created successfully!');
      } else {
        throw error;
      }
    }

    // Set custom claims (role)
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      rolePrimary: role,
      status: 'active',
    });

    console.log('\n✅ Success!');
    console.log('User UID:', userRecord.uid);
    console.log('Email:', userRecord.email);
    console.log('Display Name:', userRecord.displayName);
    console.log('Role:', role);
    console.log('\nYou can now sign in with:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating user:');
    console.error(error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

createUser();
