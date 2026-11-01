/**
 * Automated Verification & Quality Assurance Suite
 * The Wedding Reception of Jassim Hashim & Shifa Anis Khan
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const server = require('./server');

const ROOT_DIR = __dirname;
let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exitCode = 1;
  } else {
    passedTests++;
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🏛️ RUNNING CELEBRATION SUITE VERIFICATION TESTS');
  console.log('====================================================\n');

  // ----------------------------------------------------------------
  // Test Group 1: Asset and File Integrity
  // ----------------------------------------------------------------
  console.log('📁 1. Asset & Core Files Verification:');
  const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
  const errorHtmlPath = path.join(ROOT_DIR, '404.html');
  const audioFilePath = path.join(ROOT_DIR, 'assets', 'audio', 'canon-in-d.mp3');
  const cssFilePath = path.join(ROOT_DIR, 'css', 'styles.css');
  const jsFilePath = path.join(ROOT_DIR, 'js', 'main.js');

  assert(fs.existsSync(indexHtmlPath), 'index.html exists');
  assert(fs.existsSync(errorHtmlPath), '404.html exists');
  assert(fs.existsSync(audioFilePath), 'assets/audio/canon-in-d.mp3 exists');
  assert(fs.existsSync(cssFilePath), 'css/styles.css exists');
  assert(fs.existsSync(jsFilePath), 'js/main.js exists');

  const audioStats = fs.statSync(audioFilePath);
  assert(audioStats.size > 2000000, `Audio file is healthy size (${(audioStats.size / (1024 * 1024)).toFixed(2)} MB)`);

  // Verify MP3 header (either ID3 tag or MPEG sync word 0xFF 0xEx)
  const audioBuffer = Buffer.alloc(10);
  const fd = fs.openSync(audioFilePath, 'r');
  fs.readSync(fd, audioBuffer, 0, 10, 0);
  fs.closeSync(fd);
  const hasId3 = audioBuffer.slice(0, 3).toString('ascii') === 'ID3';
  const hasMpegSync = audioBuffer[0] === 0xff && (audioBuffer[1] & 0xe0) === 0xe0;
  assert(hasId3 || hasMpegSync, 'Audio asset has valid MP3 MPEG frame sync or ID3 header');

  // Verify server configuration files
  assert(fs.existsSync(path.join(ROOT_DIR, '_redirects')), '_redirects exists for Netlify / Cloudflare Pages');
  assert(fs.existsSync(path.join(ROOT_DIR, 'vercel.json')), 'vercel.json exists for Vercel deployment');
  assert(fs.existsSync(path.join(ROOT_DIR, '.htaccess')), '.htaccess exists for Apache / LiteSpeed servers');

  // ----------------------------------------------------------------
  // Test Group 2: Navigation System & Absence of 404 Links
  // ----------------------------------------------------------------
  console.log('\n🧭 2. Navigation System & 404 Link Audit:');
  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // Check that no visitor-facing nav links redirect to 404
  const has404InNav = /<nav[^>]*>[\s\S]*?404[\s\S]*?<\/nav>/i.test(indexContent);
  assert(!has404InNav, 'No 404 link exists in primary desktop navigation');

  const has404InDrawer = /<div[^>]*class="[^"]*mobile-drawer[^"]*"[^>]*>[\s\S]*?404[\s\S]*?<\/div>/i.test(indexContent);
  assert(!has404InDrawer, 'No 404 link exists in mobile navigation drawer');

  const has404InFooter = /<footer[^>]*>[\s\S]*?href="[^"]*404[^"]*"[\s\S]*?<\/footer>/i.test(indexContent);
  assert(!has404InFooter, 'No 404 link exists in website footer');

  // Validate internal section jump targets
  const hrefMatches = [...indexContent.matchAll(/href="(#([a-zA-Z0-9_-]+))"/g)];
  assert(hrefMatches.length > 0, `Found ${hrefMatches.length} internal hash anchors`);
  let allTargetsExist = true;
  for (const match of hrefMatches) {
    const targetId = match[2];
    const idRegex = new RegExp(`id=["']${targetId}["']`);
    if (!idRegex.test(indexContent)) {
      console.error(`Missing target ID for anchor: #${targetId}`);
      allTargetsExist = false;
    }
  }
  assert(allTargetsExist, 'All navigation hash links (#) resolve to valid DOM element IDs');

  // ----------------------------------------------------------------
  // Test Group 3: 404 Error Page Quality & User Experience
  // ----------------------------------------------------------------
  console.log('\n🚫 3. 404 Custom Error Page Standards:');
  const errorContent = fs.readFileSync(errorHtmlPath, 'utf8');

  assert(errorContent.includes('Page Not Found'), '404.html contains explicit "Page Not Found" label');
  assert(errorContent.includes('404'), '404.html contains 404 error code');
  assert(/href=["']index\.html["']/i.test(errorContent), '404.html contains clear button linking to homepage (index.html)');
  assert(errorContent.includes('starfield-canvas'), '404.html retains starry nocturnal theme canvas');
  assert(errorContent.includes('nav-music-widget'), '404.html contains ambient audio controls');

  // ----------------------------------------------------------------
  // Test Group 4: Audio Controller & Autoplay Architecture
  // ----------------------------------------------------------------
  console.log('\n🎵 4. Background Music Engine Verification:');
  const jsContent = fs.readFileSync(jsFilePath, 'utf8');
  assert(jsContent.includes('initBackgroundMusic'), 'js/main.js defines initBackgroundMusic()');
  assert(jsContent.includes('sessionStorage'), 'Audio state uses sessionStorage for cross-navigation persistence');
  assert(jsContent.includes('showAutoplayPrompt'), 'Audio engine provides graceful autoplay failure fallback');
  assert(jsContent.includes('canon-in-d.mp3'), 'Audio points to royalty-free Canon in D asset');
  assert(indexContent.includes('floating-music-capsule'), 'index.html contains floating ambient music capsule');
  assert(indexContent.includes('autoplay-prompt-pill'), 'index.html contains autoplay fallback prompt pill');

  // ----------------------------------------------------------------
  // Test Group 5: HTTP Server & Status Code Verification
  // ----------------------------------------------------------------
  console.log('\n🌐 5. HTTP Server, Routing & 404 Status Verification:');

  const TEST_PORT = 3456;
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));

  function request(urlPath, headers = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: TEST_PORT,
          path: urlPath,
          method: 'GET',
          headers
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body
            });
          });
        }
      );
      req.on('error', reject);
      req.end();
    });
  }

  // 5a. Valid route /
  const homeRes = await request('/');
  assert(homeRes.statusCode === 200, 'GET / returns HTTP 200 OK');
  assert(homeRes.headers['content-type'].includes('text/html'), 'GET / has text/html content-type');
  assert(homeRes.body.includes('Jassim Hashim &amp; Shifa Anis Khan'), 'GET / delivers celebration homepage');

  // 5b. Valid route /index.html
  const indexRes = await request('/index.html');
  assert(indexRes.statusCode === 200, 'GET /index.html returns HTTP 200 OK');

  // 5c. Valid CSS and JS assets
  const cssRes = await request('/css/styles.css');
  assert(cssRes.statusCode === 200 && cssRes.headers['content-type'].includes('text/css'), 'GET /css/styles.css returns HTTP 200 with text/css');

  const jsRes = await request('/js/main.js');
  assert(jsRes.statusCode === 200 && jsRes.headers['content-type'].includes('javascript'), 'GET /js/main.js returns HTTP 200 with javascript');

  // 5d. Audio asset delivery & Range streaming
  const audioRes = await request('/assets/audio/canon-in-d.mp3');
  assert(audioRes.statusCode === 200 && audioRes.headers['content-type'] === 'audio/mpeg', 'GET audio asset returns HTTP 200 with audio/mpeg');
  assert(audioRes.headers['accept-ranges'] === 'bytes', 'Audio server advertises Accept-Ranges: bytes');

  const rangeRes = await request('/assets/audio/canon-in-d.mp3', { Range: 'bytes=0-1023' });
  assert(rangeRes.statusCode === 206, 'Audio Range request returns HTTP 206 Partial Content');
  assert(rangeRes.headers['content-range'].startsWith('bytes 0-1023/'), 'Range request returns correct Content-Range header');

  // 5e. Nonexistent routes -> MUST return HTTP 404 with custom 404.html content!
  const unknownRes1 = await request('/this-page-does-not-exist');
  assert(unknownRes1.statusCode === 404, 'GET /this-page-does-not-exist returns genuine HTTP 404 status');
  assert(unknownRes1.body.includes('Page Not Found'), 'GET /this-page-does-not-exist serves custom 404 page ("Page Not Found")');
  assert(unknownRes1.body.includes('Return to Homepage'), 'GET /this-page-does-not-exist provides clear button to return to homepage');

  const unknownRes2 = await request('/reception/secret/unreleased-route');
  assert(unknownRes2.statusCode === 404, 'GET nested invalid path returns HTTP 404 status');
  assert(unknownRes2.body.includes('Beyond The Celebration Grounds'), 'GET nested invalid path serves matching nocturnal 404 design');

  // Close test server
  await new Promise((resolve) => server.close(resolve));
  console.log('\n🔒 Test server cleanly stopped.');

  // ----------------------------------------------------------------
  // Summary
  // ----------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('🌟 ALL VERIFICATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS.\n');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
