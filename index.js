// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");


// plan for articles to load
await page.waitForSelector('.athing');

// Select the first 100 articles
const articles = await page.$$('.athing');
const first100Articles = articles.slice(0,100);

// Extract timestamps for the first 100 articles
let articleData = [];
for (let article of first100Articles) {
  const title = await article.$eval('.titlelink', el => el.innerText);
  const timestamp = await article.$eval('.age', el => el.title); 
  articleData.push({ title, timestamp: new Date(timestamp) });
}

// Make sure articles are sorted from newest to oldest
let isSorted = true; 
for (let i = 0; i < articleData.length - 1; i++) {
  if (articleData[i].timestamp < articleData[i + 1].timestamp) {
    isSorted = false;
    break;
  }
}

// prints the results
console.log(isSorted ? 'Articles are sorted correctly' : 'Articles are NOT sorted correctly');

// close the browser
// await browser.close();
await page.waitForTimeout(30000);
}

(async () => {
  await sortHackerNewsArticles();
})();
