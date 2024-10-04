const { test, expect } = require('@playwright/test');

test('check Hacker News articles are sorted correctly', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');

  // Waits for articles to load.
  await page.waitForSelector('.athing');

  // Selects 100 articles.
  const articles = await page.$$('.athing');
  const first100Articles = articles.slice(0, 100);

  // Extract timestamps for the first 100 articles.
  const articleData = [];
  for (const article of first100Articles) {
    try {
      const title = await article.$eval('.titleline > a', el => el.innerText);
      const timestamp = await article.$eval('.age', el => el.title);
      // Push articles with a valid timestamp.
      if (timestamp) {
        articleData.push({ title, timestamp: new Date(timestamp) });
      } else {
        console.warn('Timestamp element not found in article:', title);
      }
    } catch (err) {
      // Logs the error if there’s any issue during data extraction.
      console.error('Error getting article data:', err);
    }
  }

  for (let i = 0; i < articleData.length - 1; i++) {
    expect(articleData[i].timestamp).toBeGreaterThanOrEqual(articleData[i + 1].timestamp);
  }
});
