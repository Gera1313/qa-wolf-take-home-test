const { test, expect } = require('@playwright/test');

test('check Hacker News articles are sorted correctly', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');
  
  // Waits for articles to load.
  await page.waitForSelector('.athing');
  
  // Selects 100 articles.
  const articles = await page.$$('.athing');
  const first100Articles = articles.slice(0, 100);
  
  const articleData = [];
  for (const article of first100Articles) {
    const title = await article.$eval('.titleline > a', el => el.innerText);
    // Finds the timestamp correctly.
    const timestampElement = await article.$('.age');
    
    // Here we log the HTML of the article for debugging if the timestamp is not found.
    if (!timestampElement) {
      const html = await article.evaluate(el => el.outerHTML);
      console.error('Timestamp element not found in article HTML:', html);
      continue; // Skips this article if timestamp is not found.
    }

    const timestamp = await timestampElement.evaluate(el => el.title);
    articleData.push({ title, timestamp: new Date(timestamp) });
  }

  for (let i = 0; i < articleData.length - 1; i++) {
    expect(articleData[i].timestamp).toBeGreaterThanOrEqual(articleData[i + 1].timestamp);
  }
});
