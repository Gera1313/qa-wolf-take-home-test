// *********************SCENARIO 2****************************************

const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://news.ycombinator.com/newest");

  await page.waitForSelector('.athing');

  const articles = await page.$$('.athing');
  const first100Articles = articles.slice(0, 100);

  let articleData = [];
  for (let article of first100Articles) {
    try {
      const title = await article.$eval('.titleline > a', el => el.innerText);
      const relativeTime = await article.$eval('.age', el => el.innerText);
      
      // Here I convert the relative time to an absolute timestamp for better accuracy. 
      const timestamp = convertRelativeTimeToDate(relativeTime);
      
      articleData.push({ title, timestamp });
    } catch (err) {
      console.error('Error getting article data:', err);
    }
  }

  let isSorted = true;
  for (let i = 0; i < articleData.length - 1; i++) {
    const currentTimestamp = articleData[i].timestamp;
    const nextTimestamp = articleData[i + 1].timestamp;
    if (currentTimestamp < nextTimestamp) {
      isSorted = false;
      break;
    }
  }

  console.log(isSorted ? 'Articles are sorted correctly' : 'Articles are NOT sorted correctly');
  
  // Pauses the browser so it doesn't close immediately.
  await page.pause();
  
  await browser.close();
}

// This is the function to convert relative time ('5 minutes ago') to a Date object.
function convertRelativeTimeToDate(relativeTime) {
  const now = new Date(); // Current time
  
  // Extracts the number and the unit ('5' and 'minutes' from '5 minutes ago').
  const [amount, unit] = relativeTime.split(' ');

  // Converts the amount to a number.
  const timeAmount = parseInt(amount);

  // Here we subtract the appropriate time based on the unit.
  if (unit.includes('second')) {
    return new Date(now.getTime() - timeAmount * 1000);
  } else if (unit.includes('minute')) {
    return new Date(now.getTime() - timeAmount * 60 * 1000);
  } else if (unit.includes('hour')) {
    return new Date(now.getTime() - timeAmount * 60 * 60 * 1000);
  } else if (unit.includes('day')) {
    return new Date(now.getTime() - timeAmount * 24 * 60 * 60 * 1000);
  }

  return now; // Default case, if format is not recognized
}

(async () => {
  await sortHackerNewsArticles();
})();