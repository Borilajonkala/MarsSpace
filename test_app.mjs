import { chromium } from 'playwright';

async function runTests() {
  console.log('🚀 Starting Playwright tests for MarsSpace application...\n');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => {
    console.error('❌ Page Error:', err.message);
    pageErrors.push(err.message);
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore expected failed fetch to localhost:3000 json-server
      if (!text.includes('localhost:3000') && !text.includes('ERR_CONNECTION_REFUSED')) {
        console.error('❌ Console Error:', text);
        consoleErrors.push(text);
      }
    }
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      testsFailed++;
    }
  }

  try {
    // TEST 1: Asosiy (Home) Page
    console.log('--- TEST 1: Asosiy (/) ---');
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(500);
    const title = await page.title();
    assert(title !== '', `Title exists: "${title}"`);

    const hasMarsLogo = (await page.locator('text=MARS').count()) > 0;
    assert(hasMarsLogo, 'Mars Logo is present');

    const hasNavAsosiy = (await page.locator('nav >> text=Asosiy').count()) > 0;
    assert(hasNavAsosiy, 'Sidebar contains "Asosiy"');

    // TEST 2: Kurslarim / About Page
    console.log('\n--- TEST 2: Kurslarim / Profil (/about) ---');
    await page.goto('http://localhost:5173/about');
    await page.waitForTimeout(500);
    const hasCoursesSection = (await page.locator('text=Mavjud Kurslar va Dasturlar').count()) > 0;
    assert(hasCoursesSection, 'Courses overview is displayed');

    // TEST 3: Mening ishlarim (/my-works)
    console.log('\n--- TEST 3: Mening ishlarim (/my-works) ---');
    await page.goto('http://localhost:5173/my-works');
    await page.waitForTimeout(500);
    const hasFrontEnd = (await page.locator('text=Front-End').count()) > 0;
    assert(hasFrontEnd, 'Course track "Front-End" is displayed');
    const hasSizRocket = (await page.locator('text=SIZ').count()) > 0;
    assert(hasSizRocket, 'Student position on roadmap is displayed');
    const hasCertificate = (await page.locator('text=sertifikat tayyor').count()) > 0;
    assert(hasCertificate, 'Certificate section is displayed');

    // TEST 4: O\'yin-kulgi (/games)
    console.log('\n--- TEST 4: O\'yin-kulgi (/games) ---');
    await page.goto('http://localhost:5173/games');
    await page.waitForTimeout(500);
    const hasBattle = (await page.locator('text=JANG XONASI').count()) > 0;
    assert(hasBattle, 'Entertainment battle lobby loaded');
    const hasRoomBtn = (await page.locator('text=XONA OCHISH').count()) > 0;
    assert(hasRoomBtn, 'Open room button loaded');

    // TEST 5: Alogo (/alogo)
    console.log('\n--- TEST 5: Alogo (/alogo) ---');
    await page.goto('http://localhost:5173/alogo');
    await page.waitForTimeout(500);
    const hasAlogoTitle = (await page.locator('text=TOP Kompaniyalar').count()) > 0;
    assert(hasAlogoTitle, 'TOP Kompaniyalar is displayed');
    const hasCompany = (await page.locator('text=Amazon').count()) > 0;
    assert(hasCompany, 'Amazon task is displayed');

    // TEST 6: Blog (/blog)
    console.log('\n--- TEST 6: Blog (/blog) ---');
    await page.goto('http://localhost:5173/blog');
    await page.waitForTimeout(500);
    const hasBlogPrompt = (await page.locator("text=Darsda nima o'rgandingiz?").count()) > 0;
    assert(hasBlogPrompt, 'Blog input prompt is visible');
    const hasEngZor = (await page.locator("text=Eng zo'r").count()) > 0;
    assert(hasEngZor, "Eng zo'r badge is visible");

    // TEST 7: Tadbirlar va to\'garaklar (/events)
    console.log('\n--- TEST 7: Tadbirlar va to\'garaklar (/events) ---');
    await page.goto('http://localhost:5173/events');
    await page.waitForTimeout(500);
    const hasClubs = (await page.locator("text=To'garaklar").count()) > 0;
    assert(hasClubs, 'Clubs section is displayed');
    const hasChess = (await page.locator('text=Shaxmat').count()) > 0;
    assert(hasChess, 'Chess club is present');

    // TEST 8: Reyting (/rating)
    console.log('\n--- TEST 8: Reyting (/rating) ---');
    await page.goto('http://localhost:5173/rating');
    await page.waitForTimeout(500);
    const hasRating = (await page.locator('text=Reyting va Yutuqlar').count()) > 0;
    assert(hasRating, 'Rating leaderboard is displayed');

    // TEST 9: Login Flow (/login)
    console.log('\n--- TEST 9: Login Flow (/login) ---');
    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(500);
    const hasLoginForm = (await page.locator('text=Xodimlar uchun kirish').count()) > 0;
    assert(hasLoginForm, 'Login page title is correct');

    // Fill credentials for mentor Javohir Toshpulatov
    await page.fill('input[placeholder="+998"]', 'MID-1042');
    await page.fill('input[placeholder="Parol"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    assert(currentUrl.endsWith('/') || !currentUrl.includes('/login'), `Redirected to home after login: ${currentUrl}`);

    // Check that user is recognized in header dropdown
    await page.click('div[role="button"].avatar');
    await page.waitForTimeout(300);
    const hasMentorName = (await page.locator('text=Javohir Toshpulatov').count()) > 0;
    assert(hasMentorName, 'Logged in mentor name is shown in profile dropdown');

    // Logout
    await page.click('text=Chiqish (Logout)');
    await page.waitForTimeout(1000);
    const afterLogoutUrl = page.url();
    assert(afterLogoutUrl.includes('/login'), `Redirected to /login after logout: ${afterLogoutUrl}`);

    // Final error check
    console.log('\n--- TEST 10: Error Diagnostics ---');
    assert(pageErrors.length === 0, `0 Page Runtime Errors (found: ${pageErrors.length})`);
    assert(consoleErrors.length === 0, `0 Console Errors (found: ${consoleErrors.length})`);

  } catch (error) {
    console.error('Unexpected test error:', error);
    testsFailed++;
  } finally {
    await browser.close();
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log(`========================================\n`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
