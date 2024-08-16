// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
}

// plan for articles to load
await page.waitForSelector('.athing');

// Select the first 100 articles

// Extract timestamps for the first 100 articles

// Make sure articles are sorted from newest to oldest

(async () => {
  await sortHackerNewsArticles();
})();
