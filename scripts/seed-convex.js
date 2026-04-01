#!/usr/bin/env node

/**
 * Seed directories.json into Convex via the seedDirectories mutation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConvexClient } from 'convex/browser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const directoriesPath = path.join(__dirname, '../data/directories.json');

// Load directories
const directories = JSON.parse(fs.readFileSync(directoriesPath, 'utf-8'));

console.log(`📊 Loaded ${directories.length} directories from data/directories.json`);

// Initialize Convex client
// Using the CONVEX_DEPLOY_KEY from environment
const client = new ConvexClient(process.env.CONVEX_URL || 'https://citation-manager.convex.cloud');

// Run the seed mutation
try {
  console.log(`🌱 Seeding ${directories.length} directories into Convex...`);
  
  const result = await client.mutation('directories:seedDirectories', {
    directories: directories,
    clearExisting: true,
  });
  
  console.log(`\n✅ Seed completed!`);
  console.log(`   Inserted: ${result.inserted}`);
  console.log(`   Total: ${result.total}`);
  
  if (result.inserted === result.total) {
    console.log(`\n🎉 SUCCESS: All ${result.total} directories seeded!`);
  } else {
    console.warn(`\n⚠️  Warning: Only ${result.inserted}/${result.total} directories inserted`);
  }
  
} catch (error) {
  console.error(`\n❌ Seed failed:`, error.message);
  process.exit(1);
}

process.exit(0);
