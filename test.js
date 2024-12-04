const { chromium } = require('playwright');  // Import Playwright's Chromium browser

(async () => {
  const browser = await chromium.launch();  // Launch Chromium
  const page = await browser.newPage();     // Open a new page
  await page.goto('https://example.com');   // Go to a website
  console.log(await page.title());          // Print the page title to the console
  await browser.close();                   // Close the browser
})();
