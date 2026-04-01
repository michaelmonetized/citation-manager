#!/usr/bin/env node

/**
 * Frontend Integration Tests - Phase 2B
 * Tests the complete user flow: Dashboard → Locations → Submit → Submissions
 */

// Node.js 18+ has built-in fetch

const BASE_URL = 'http://localhost:3000';

// Test data
const TEST_LOCATION_ID = 'k17cp8x6byp3c3xd03k12wk735841w20';
const TEST_USER_EMAIL = 'test@example.com';

let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    console.log(`\n🧪 ${name}`);
    await fn();
    console.log(`✅ PASSED`);
    testsPassed++;
  } catch (err) {
    console.error(`❌ FAILED: ${err.message}`);
    testsFailed++;
  }
}

async function fetchPage(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'User-Agent': 'Phase2B-Tests',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response;
}

async function fetchJSON(path, method = 'POST', body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${data.error || data.message || JSON.stringify(data)}`
    );
  }
  
  return data;
}

async function runTests() {
  console.log('=============================================');
  console.log('Phase 2B Frontend Integration Tests');
  console.log('=============================================');
  
  // Test 1: Dashboard page loads
  await test('Dashboard page loads (HTML)', async () => {
    const response = await fetchPage('/dashboard');
    const html = await response.text();
    if (!html.includes('Citation Manager')) {
      throw new Error('Dashboard HTML missing expected content');
    }
  });
  
  // Test 2: Locations page loads
  await test('Locations page loads (HTML)', async () => {
    const response = await fetchPage('/locations');
    const html = await response.text();
    if (!html.includes('📍 Add Business Location')) {
      throw new Error('Locations page missing expected content');
    }
  });
  
  // Test 3: Submit page loads
  await test('Submit page loads (HTML)', async () => {
    const response = await fetchPage('/submit');
    const html = await response.text();
    if (!html.includes('Submit to Directories')) {
      throw new Error('Submit page missing expected content');
    }
  });
  
  // Test 4: Submissions dashboard page loads
  await test('Submissions page loads (HTML)', async () => {
    const response = await fetchPage('/submissions');
    const html = await response.text();
    if (!html.includes('submission')) {
      console.log('(warning: minimal HTML content expected)');
    }
  });
  
  // Test 5: Seed directories API works
  await test('Seed directories API route', async () => {
    const data = await fetchJSON('/api/seed-directories', 'POST', {});
    if (!data.success || !data.inserted) {
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }
    console.log(`  → Seeded ${data.inserted} directories`);
  });
  
  // Test 6: Google API route responds
  await test('Google API route accessible', async () => {
    const data = await fetchJSON(
      '/api/integrations/google',
      'POST',
      {
        locationId: TEST_LOCATION_ID,
        directoryId: 'jx7b3ab8j2ee79wgkhx9056q7n840jtq', // Google Business Profile
      }
    );
    // Expected to fail due to missing credentials, but route should exist and handle it gracefully
    if (!data.error && !data.status) {
      throw new Error('Unexpected response format');
    }
    console.log(`  → Route responded with: ${data.status || 'error'}`);
  });
  
  // Test 7: Yelp API route responds  
  await test('Yelp API route accessible', async () => {
    const response = await fetch(`${BASE_URL}/api/integrations/yelp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: TEST_LOCATION_ID,
        directoryId: 'jx7b3ab8j2ee79wgkhx9056q7n840jtq',
      }),
    });
    
    if (response.status !== 200 && response.status !== 500) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`  → Route responded with status: ${response.status}`);
  });
  
  // Test 8: Facebook API route responds
  await test('Facebook API route accessible', async () => {
    const response = await fetch(`${BASE_URL}/api/integrations/facebook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: TEST_LOCATION_ID,
        directoryId: 'jx7b3ab8j2ee79wgkhx9056q7n840jtq',
      }),
    });
    
    if (response.status !== 200 && response.status !== 500) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`  → Route responded with status: ${response.status}`);
  });
  
  // Test 9: Verify dev server responds to all routes
  await test('Dev server handles multiple routes without errors', async () => {
    const routes = ['/auth', '/dashboard', '/locations', '/submit', '/submissions', '/directories'];
    for (const route of routes) {
      const response = await fetch(`${BASE_URL}${route}`);
      if (response.status !== 200) {
        throw new Error(`${route} returned ${response.status}`);
      }
    }
    console.log(`  → All ${routes.length} routes accessible`);
  });
  
  // Test 10: API parameter validation
  await test('API routes validate parameters', async () => {
    const response = await fetch(`${BASE_URL}/api/integrations/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* missing parameters */ }),
    });
    
    const data = await response.json();
    if (!data.error || response.status === 200) {
      throw new Error('Should reject invalid parameters');
    }
    console.log(`  → Correctly rejected invalid request`);
  });
  
  console.log('\n=============================================');
  console.log('Frontend Integration Test Results');
  console.log('=============================================');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${testsFailed} test(s) failed`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(2);
});
