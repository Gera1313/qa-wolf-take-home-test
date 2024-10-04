// *********************SCENARIO 1****************************************

// // I begin by importing the "chromium" module from Playwright. 
// const { chromium } = require("playwright");

// // The script runs within an asynchronous function called 'sortHackerNewsArticles'.
// async function sortHackerNewsArticles() {
//   // launch browser
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   // Go to Hacker News. 
//   // I create a new browswer and page, and navigate to the "newest" page on Hacker News by using the 'page.goto()' method. 
//   await page.goto("https://news.ycombinator.com/newest");

//   // Wait for articles to load. 
//   // I ensure that all articles are loaded before proceeding. I do this by waiting for the selector .athing, which is the class used for the article containers.
//   await page.waitForSelector('.athing');

//   // Select the firt 100 articles. 
//   // I then select all articles using $$('.athing') and slice the first 100 articles to work with.
//   const articles = await page.$$('.athing');
//   const first100Articles = articles.slice(0, 100);

//   // Extract timestamps for the first 100 articles
//   // I extract the title and timestamp of the articles. I use 'article.$eval()' to query and evaluate the elements inside each article. Timestamp is converted to a 'Date' object. 
//   let articleData = [];
//   for (let article of first100Articles) {
//     try {
//       const title = await article.$eval('.titleline > a', el => el.innerText);
//       const timestamp = await article.$eval('.age', el => el.title);
//       articleData.push({ title, timestamp: new Date(timestamp) });
//     } catch (err) {
//       // If there’s any issue during data extraction, such as a missing element, the error is caught and logged, ensuring the script doesn’t crash.
//       console.error('Error getting article data:', err);
//     }
//   } 

//   // Makes sure articles are sorted from newest to oldest
//   // I loop through the articleData array and compare each article’s timestamp with the next one. If any article is older than the next one, I flag that the articles are not sorted correctly.
//   let isSorted = true;
//   for (let i = 0; i < articleData.length - 1; i++) {
//     if (articleData[i].timestamp < articleData[i + 1].timestamp) {
//       isSorted = false;
//       break;
//     }
//   }

//   // Print the results. 
//   // I output the result to the console. It will either confirm that the articles are sorted correctly or indicate that they aren’t based on the value of 'isSorted'. 
//   console.log(isSorted ? 'Articles are sorted correctly' : 'Articles are NOT sorted correctly');
// }

// (async () => {
//   await sortHackerNewsArticles();
// })();

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