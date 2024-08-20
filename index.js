// I begin by importing the "chromium" module from Playwright. 
const { chromium } = require("playwright");

// The script runs within an asynchronous function called 'sortHackerNewsArticles'.
async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News. I create a new browswer and page, and navigate to the "newest" page on Hacker News by using the 'page.goto()' method. 
  await page.goto("https://news.ycombinator.com/newest");

  // Wait for articles to load. I ensure that all articles are loaded before proceeding. I do this by waiting for the selector .athing, which is the class used for the article containers.
  await page.waitForSelector('.athing');

  // I then select all articles using $$('.athing') and slice the first 100 articles to work with.
  const articles = await page.$$('.athing');
  const first100Articles = articles.slice(0, 100);

  // Extract timestamps for the first 100 articles
  // I extract the title and timestamp of the articles. I use 'article.$eval()' to query and evaluate the elements inside each article. Timestamp is converted to a 'Date' object. 
  let articleData = [];
  for (let article of first100Articles) {
    try {
      const title = await article.$eval('.titleline > a', el => el.innerText);
      const timestamp = await article.$eval('.age', el => el.title);
      articleData.push({ title, timestamp: new Date(timestamp) });
    } catch (err) {
      // If there’s any issue during data extraction, such as a missing element, the error is caught and logged, ensuring the script doesn’t crash.
      console.error('Error getting article data:', err);
    }
  } 

  // Makes sure articles are sorted from newest to oldest
  let isSorted = true;
  for (let i = 0; i < articleData.length - 1; i++) {
    if (articleData[i].timestamp < articleData[i + 1].timestamp) {
      isSorted = false;
      break;
    }
  }

  // Print the results
  console.log(isSorted ? 'Articles are sorted correctly' : 'Articles are NOT sorted correctly');
}

(async () => {
  await sortHackerNewsArticles();
})();
