#!/usr/bin/env node
/**
 * Standalone Gallery Sync Runner
 * ================================
 * 
 * This script can be run from ANY computer (not just from Figma's environment).
 * It synchronizes your Google Drive gallery folder to your Supabase database.
 * 
 * PREREQUISITES:
 * 1. Node.js installed (v18 or higher recommended)
 * 2. .env.local file configured with your credentials
 * 3. Database tables created (run the SQL migration first)
 * 
 * HOW TO RUN:
 * -----------
 * 
 * Option 1: Run directly from project folder
 *   $ node run-sync.js
 * 
 * Option 2: Make it executable and run
 *   $ chmod +x run-sync.js
 *   $ ./run-sync.js
 * 
 * Option 3: Use the npm script (if you have package.json)
 *   $ npm run sync:gallery
 * 
 * WHAT THIS SCRIPT DOES:
 * ----------------------
 * 1. Loads environment variables from .env.local
 * 2. Installs required npm packages if needed
 * 3. Runs the gallery sync script
 * 4. Shows you the results
 * 
 * SCHEDULING AUTOMATIC SYNCS:
 * ---------------------------
 * - Set up a cron job on your computer/server to run this daily
 * - Use GitHub Actions to run on a schedule (see documentation)
 * - Use a cloud scheduler service (e.g., AWS Lambda, Google Cloud Functions)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('');
  log('═'.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('═'.repeat(60), 'cyan');
  console.log('');
}

async function checkEnvironmentFile() {
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ ERROR: .env.local file not found!', 'red');
    log('', 'reset');
    log('Please create a .env.local file in the project root with:', 'yellow');
    log('  - GDRIVE_SERVICE_ACCOUNT_KEY', 'yellow');
    log('  - GDRIVE_GALLERY_ROOT_FOLDER', 'yellow');
    log('  - SUPABASE_URL', 'yellow');
    log('  - SUPABASE_SERVICE_ROLE_KEY', 'yellow');
    log('', 'reset');
    log('See .env.example for the template.', 'yellow');
    process.exit(1);
  }
  
  log('✅ Found .env.local file', 'green');
}

async function loadEnvironment() {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse .env file (simple parser)
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=');
        // Remove quotes if present
        if ((value.startsWith("'") && value.endsWith("'")) || 
            (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        process.env[key.trim()] = value;
      }
    }
  }
  
  // Validate required variables
  const required = [
    'GDRIVE_SERVICE_ACCOUNT_KEY',
    'GDRIVE_GALLERY_ROOT_FOLDER',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log('❌ ERROR: Missing required environment variables:', 'red');
    missing.forEach(key => log(`   - ${key}`, 'red'));
    process.exit(1);
  }
  
  log('✅ Environment variables loaded', 'green');
}

async function checkDependencies() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ ERROR: package.json not found!', 'red');
    log('This script must be run from the project root directory.', 'yellow');
    process.exit(1);
  }
  
  if (!fs.existsSync(nodeModulesPath)) {
    log('⚠️  node_modules not found. Installing dependencies...', 'yellow');
    
    return new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], { stdio: 'inherit' });
      
      npm.on('close', (code) => {
        if (code !== 0) {
          log('❌ Failed to install dependencies', 'red');
          reject(new Error('npm install failed'));
        } else {
          log('✅ Dependencies installed', 'green');
          resolve();
        }
      });
    });
  }
  
  log('✅ Dependencies ready', 'green');
}

async function runSync() {
  const scriptPath = path.join(__dirname, 'scripts', 'syncGalleryFromDrive.ts');
  
  if (!fs.existsSync(scriptPath)) {
    log('❌ ERROR: Sync script not found!', 'red');
    log(`Expected location: ${scriptPath}`, 'yellow');
    process.exit(1);
  }
  
  log('🚀 Starting gallery sync...', 'cyan');
  log('', 'reset');
  
  return new Promise((resolve, reject) => {
    const tsx = spawn('npx', ['tsx', scriptPath], { 
      stdio: 'inherit',
      env: process.env,
    });
    
    tsx.on('close', (code) => {
      if (code !== 0) {
        log('', 'reset');
        log('❌ Sync failed with errors', 'red');
        reject(new Error(`Sync script exited with code ${code}`));
      } else {
        log('', 'reset');
        log('🎉 Sync completed successfully!', 'green');
        resolve();
      }
    });
  });
}

async function main() {
  try {
    header('Gallery Sync Runner');
    
    log('Step 1: Checking environment...', 'blue');
    await checkEnvironmentFile();
    await loadEnvironment();
    console.log('');
    
    log('Step 2: Checking dependencies...', 'blue');
    await checkDependencies();
    console.log('');
    
    log('Step 3: Running sync...', 'blue');
    await runSync();
    console.log('');
    
    header('✅ All Done!');
    log('Your gallery has been synced from Google Drive to Supabase.', 'green');
    log('The website will now display the latest images.', 'green');
    console.log('');
    
  } catch (error) {
    console.log('');
    log('═'.repeat(60), 'red');
    log('  SYNC FAILED', 'red');
    log('═'.repeat(60), 'red');
    console.log('');
    log(error.message, 'red');
    console.log('');
    process.exit(1);
  }
}

// Run the script
main();
