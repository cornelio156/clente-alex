#!/usr/bin/env node

/**
 * Script to automatically setup the Appwrite database
 * Run with: node scripts/setup-database.js
 */

const { Client, Databases, Storage } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_URL || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'db',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || 'videos'
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function deleteExistingCollections() {
  try {
    logInfo('Checking for existing collections...');
    
    const collections = ['videos', 'payment_proofs', 'site_config', 'paypal_payments'];
    
    for (const collectionId of collections) {
      try {
        logInfo(`Deleting existing collection: ${collectionId}`);
        await databases.deleteCollection(config.databaseId, collectionId);
        logSuccess(`Collection ${collectionId} deleted successfully`);
      } catch (error) {
        if (error.code === 404) {
          logWarning(`Collection ${collectionId} does not exist, skipping deletion`);
        } else {
          logWarning(`Could not delete collection ${collectionId}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    logWarning(`Error during collection cleanup: ${error.message}`);
  }
}

async function deleteExistingStorage() {
  try {
    logInfo('Checking for existing storage bucket...');
    
    try {
      logInfo(`Deleting existing storage bucket: ${config.storageId}`);
      await storage.deleteBucket(config.storageId);
      logSuccess(`Storage bucket ${config.storageId} deleted successfully`);
    } catch (error) {
      if (error.code === 404) {
        logWarning(`Storage bucket ${config.storageId} does not exist, skipping deletion`);
      } else {
        logWarning(`Could not delete storage bucket ${config.storageId}: ${error.message}`);
      }
    }
  } catch (error) {
    logWarning(`Error during storage cleanup: ${error.message}`);
  }
}

async function createDatabase() {
  try {
    logInfo('Creating database...');
    await databases.create(config.databaseId, 'Main Database');
    logSuccess('Database created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Database already exists');
    } else {
      throw error;
    }
  }
}

async function createStorage() {
  try {
    logInfo('Creating storage bucket...');
    await storage.createBucket(config.storageId, 'Videos Storage');
    logSuccess('Storage bucket created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Storage bucket already exists');
    } else {
      throw error;
    }
  }
}

async function createVideosCollection() {
  try {
    logInfo('Creating videos collection...');
    await databases.createCollection(
      config.databaseId,
      'videos',
      'Videos',
      ['read("any")', 'write("any")'],
      false
    );
    logSuccess('Videos collection created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Videos collection already exists');
    } else {
      throw error;
    }
  }
}

async function createPaymentProofsCollection() {
  try {
    logInfo('Creating payment proofs collection...');
    await databases.createCollection(
      config.databaseId,
      'payment_proofs',
      'Payment Proofs',
      ['read("any")', 'write("any")'],
      false
    );
    logSuccess('Payment proofs collection created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Payment proofs collection already exists');
    } else {
      throw error;
    }
  }
}

async function createSiteConfigCollection() {
  try {
    logInfo('Creating site config collection...');
    await databases.createCollection(
      config.databaseId,
      'site_config',
      'Site Configuration',
      ['read("any")', 'write("any")'],
      false
    );
    logSuccess('Site config collection created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Site config collection already exists');
    } else {
      throw error;
    }
  }
}

async function createPayPalPaymentsCollection() {
  try {
    logInfo('Creating PayPal payments collection...');
    await databases.createCollection(
      config.databaseId,
      'paypal_payments',
      'PayPal Payments',
      ['read("any")', 'write("any")'],
      false
    );
    logSuccess('PayPal payments collection created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('PayPal payments collection already exists');
    } else {
      throw error;
    }
  }
}

async function createVideosAttributes() {
  try {
    logInfo('Creating videos collection attributes...');
    
    // Title
    await databases.createStringAttribute(config.databaseId, 'videos', 'title', 255, true);
    
    // Description
    await databases.createStringAttribute(config.databaseId, 'videos', 'description', 1000, true);
    
    // Price
    await databases.createFloatAttribute(config.databaseId, 'videos', 'price', true, 0);
    
    // Duration
    await databases.createStringAttribute(config.databaseId, 'videos', 'duration', 50, false);
    
    // Upload Date
    await databases.createDatetimeAttribute(config.databaseId, 'videos', 'uploadDate', false);
    
    // Status
    await databases.createEnumAttribute(
      config.databaseId, 
      'videos', 
      'status', 
      ['published', 'draft', 'processing'], 
      true
    );
    
    // Views
    await databases.createIntegerAttribute(config.databaseId, 'videos', 'views', false);
    
    // Tags
    await databases.createStringAttribute(config.databaseId, 'videos', 'tags', 1000, false);
    
    // Video File ID
    await databases.createStringAttribute(config.databaseId, 'videos', 'videoFileId', 255, false);
    
    // Video URL
    await databases.createStringAttribute(config.databaseId, 'videos', 'videoUrl', 1000, false);
    
    // Product Link (delivered after payment)
    await databases.createStringAttribute(config.databaseId, 'videos', 'productLink', 1000, false);
    
    // File Size
    await databases.createIntegerAttribute(config.databaseId, 'videos', 'fileSize', false);
    
    // MIME Type
    await databases.createStringAttribute(config.databaseId, 'videos', 'mimeType', 100, false);
    
    logSuccess('Videos collection attributes created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Videos collection attributes already exist');
    } else {
      throw error;
    }
  }
}

async function createPaymentProofsAttributes() {
  try {
    logInfo('Creating payment proofs collection attributes...');
    
    // Image URL
    await databases.createStringAttribute(config.databaseId, 'payment_proofs', 'imageUrl', 1000, true);
    
    // Image File ID
    await databases.createStringAttribute(config.databaseId, 'payment_proofs', 'imageFileId', 255, true);
    
    // Status
    await databases.createEnumAttribute(
      config.databaseId, 
      'payment_proofs', 
      'status', 
      ['pending', 'approved', 'rejected'], 
      true
    );
    
    // Is Visible
    await databases.createBooleanAttribute(config.databaseId, 'payment_proofs', 'isVisible', false);
    
    logSuccess('Payment proofs collection attributes created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Payment proofs collection attributes already exist');
    } else {
      throw error;
    }
  }
}

async function createSiteConfigAttributes() {
  try {
    logInfo('Creating site config collection attributes...');
    
    // Telegram Username
    await databases.createStringAttribute(config.databaseId, 'site_config', 'telegramUsername', 255, true);
    
    // Site Name
    await databases.createStringAttribute(config.databaseId, 'site_config', 'siteName', 255, true);
    
    // Description
    await databases.createStringAttribute(config.databaseId, 'site_config', 'description', 1000, true);
    
    // PayPal Client ID
    await databases.createStringAttribute(config.databaseId, 'site_config', 'paypalClientId', 255, false);
    
    // PayPal Environment
    await databases.createEnumAttribute(
      config.databaseId, 
      'site_config', 
      'paypalEnvironment', 
      ['sandbox', 'live'], 
      false
    );
    
    logSuccess('Site config collection attributes created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Site config collection attributes already exist');
    } else {
      throw error;
    }
  }
}

async function createPayPalPaymentsAttributes() {
  try {
    logInfo('Creating PayPal payments collection attributes...');
    
    // Video ID
    await databases.createStringAttribute(config.databaseId, 'paypal_payments', 'videoId', 255, true);
    
    // Video Title
    await databases.createStringAttribute(config.databaseId, 'paypal_payments', 'videoTitle', 500, true);
    
    // Amount
    await databases.createFloatAttribute(config.databaseId, 'paypal_payments', 'amount', true, 0);
    
    // Currency
    await databases.createStringAttribute(config.databaseId, 'paypal_payments', 'currency', 10, true);
    
    // Status
    await databases.createEnumAttribute(
      config.databaseId, 
      'paypal_payments', 
      'status', 
      ['pending', 'completed', 'failed'], 
      true
    );
    
    // PayPal Order ID
    await databases.createStringAttribute(config.databaseId, 'paypal_payments', 'paypalOrderId', 255, false);
    
    // PayPal Payer ID
    await databases.createStringAttribute(config.databaseId, 'paypal_payments', 'paypalPayerId', 255, false);
    
    // Created At
    await databases.createDatetimeAttribute(config.databaseId, 'paypal_payments', 'createdAt', true);
    
    // Completed At
    await databases.createDatetimeAttribute(config.databaseId, 'paypal_payments', 'completedAt', false);
    
    logSuccess('PayPal payments collection attributes created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('PayPal payments collection attributes already exist');
    } else {
      throw error;
    }
  }
}

async function createDefaultSiteConfig() {
  try {
    logInfo('Creating default site configuration...');
    
    const defaultConfig = {
      telegramUsername: 'alexchannel',
      siteName: 'VipAcess',
      description: 'Exclusive Premium Content +18',
      paypalClientId: '',
      paypalEnvironment: 'sandbox'
    };
    
    try {
      await databases.createDocument(
        config.databaseId,
        'site_config',
        'main',
        defaultConfig
      );
      logSuccess('Default site configuration created successfully');
    } catch (error) {
      if (error.code === 409) {
        logWarning('Default site configuration already exists');
      } else {
        throw error;
      }
    }
  } catch (error) {
    logError(`Error creating default site config: ${error.message}`);
  }
}

async function createIndexes() {
  try {
    logInfo('Creating database indexes...');
    
    // Videos collection indexes
    await databases.createIndex(config.databaseId, 'videos', 'title', 'key', ['title']);
    await databases.createIndex(config.databaseId, 'videos', 'status', 'key', ['status']);
    await databases.createIndex(config.databaseId, 'videos', 'price', 'key', ['price']);
    await databases.createIndex(config.databaseId, 'videos', 'uploadDate', 'key', ['uploadDate']);
    
    // Payment proofs collection indexes
    await databases.createIndex(config.databaseId, 'payment_proofs', 'status', 'key', ['status']);
    await databases.createIndex(config.databaseId, 'payment_proofs', 'paymentDate', 'key', ['paymentDate']);
    
    // PayPal payments collection indexes
    await databases.createIndex(config.databaseId, 'paypal_payments', 'videoId', 'key', ['videoId']);
    await databases.createIndex(config.databaseId, 'paypal_payments', 'status', 'key', ['status']);
    await databases.createIndex(config.databaseId, 'paypal_payments', 'createdAt', 'key', ['createdAt']);
    
    logSuccess('Database indexes created successfully');
  } catch (error) {
    if (error.code === 409) {
      logWarning('Some indexes already exist');
    } else {
      logError(`Error creating indexes: ${error.message}`);
    }
  }
}

async function main() {
  try {
    log('🚀 Starting Appwrite database setup...', 'bright');
    
    // Validate configuration
    if (!config.projectId || !config.apiKey) {
      throw new Error('Missing required environment variables. Please check your .env.local file.');
    }
    
    logInfo(`Project ID: ${config.projectId}`);
    logInfo(`Database ID: ${config.databaseId}`);
    logInfo(`Storage ID: ${config.storageId}`);
    
    // Clean up existing collections and storage
    logInfo('🧹 Cleaning up existing collections and storage...');
    await deleteExistingCollections();
    await deleteExistingStorage();
    
    // Wait a bit for cleanup to complete
    logInfo('⏳ Waiting for cleanup to complete...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create database structure
    await createDatabase();
    await createStorage();
    
    // Create collections
    await createVideosCollection();
    await createPaymentProofsCollection();
    await createSiteConfigCollection();
    await createPayPalPaymentsCollection();
    
    // Create attributes
    await createVideosAttributes();
    await createPaymentProofsAttributes();
    await createSiteConfigAttributes();
    await createPayPalPaymentsAttributes();
    
    // Create indexes
    await createIndexes();
    
    // Create default configuration
    await createDefaultSiteConfig();
    
    logSuccess('🎉 Database setup completed successfully!');
    logInfo('You can now start using your application.');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main };
