#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConvexClient } from 'convex/browser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const directoriesPath = path.join(__dirname, '../data/directories.json');

// Load directories
const directories = JSON.parse(fs.readFileSync(directoriesPath, 'utf-8'));

console.log(`📊 Loaded ${directories.length} directories from data/directories.json`);
console.log(`🌱 Seeding into Convex...\n`);

// Create a local client for testing
// In production, this would be called from within Convex itself
// For now, we'll call it directly from Convex CLI

// Since convex run doesn't support complex args, we'll use the API directly
const convexUrl = process.env.CONVEX_URL || 'https://citation-manager.convex.cloud';
const deployKey = process.env.CONVEX_DEPLOY_KEY;

if (!deployKey) {
  console.error('❌ CONVEX_DEPLOY_KEY not set. Cannot seed.');
  process.exit(1);
}

console.log(`URL: ${convexUrl}`);
console.log(`Deploying with key: ${deployKey.substring(0, 20)}...`);

// Make API call directly to Convex
const payload = {
  path: 'directories:seedDirectories',
  args: {
    directories,
    clearExisting: true
  }
};

const url = new URL(convexUrl);
url.pathname = '/run';

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${deployKey}`,
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const error = await response.json();
  console.error('❌ Seed failed:', error);
  process.exit(1);
}

const result = await response.json();
console.log(`\n✅ Seed completed!`);
console.log(`   Inserted: ${result.inserted || result?.data?.inserted || '?'}`);
console.log(`   Total: ${result.total || result?.data?.total || directories.length}`);

if ((result.inserted || result?.data?.inserted) === directories.length) {
  console.log(`\n🎉 SUCCESS: All ${directories.length} directories seeded!`);
  process.exit(0);
} else {
  console.warn(`\n⚠️  Warning: Check seed results`);
  process.exit(0);
}
