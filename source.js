const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
let list = "";
// Function to scrape problems from a Codeforces problemset page
async function scrapePage(page) {
  try {
    const response = await axios.get(
      `https://codeforces.com/problemset/page/${page}?list=${list}`
    );
    const $ = cheerio.load(response.data);
    const table = $("table.problems");

    // Get all the rows of the table except the first one (header)
    const rows = table.find("tr:not(:first-child)");

    // Create an empty array to store the scraped problems
    const problems = [];

    // Loop through each row
    rows.each((i, row) => {
      // Get the cells of the row
      const cells = $(row).find("td");

      // Get the problem ID, name, and tags from the cells
      const id = $(cells[0]).text().trim();
      const name = $(cells[1]).find("a:first").text().trim();
      const link =
        "https://codeforces.com/" +
        $(cells[1]).find("a:first").attr("href").trim();
      const tags = $(cells[1])
        .find("a:not(:first)")
        .map(function () {
          return $(this).text();
        })
        .get();

      const cntSolved = $(cells[4]).find("span").text().trim();
      const totalSolved = $(cells[4]).find("a").text().trim();
      const difficulty = $(cells[3]).text().trim();

      // Create an object to store the problem data
      const problem = {
        id: id,
        name: name,
        link: link,
        tags: tags,
        solved: cntSolved,
        difficulty: difficulty,
        totalSolved: totalSolved,
      };

      problems.push(problem);
    });

    return problems;
  } catch (error) {
    console.error("An error occurred while scraping:", error);
    return [];
  }
}

// Function to scrape all pages of the Codeforces problemset
async function scrapeAllPages() {
  return new Promise(async (resolve, reject) => {
    let currentPage = 1;
    let problems = [];
    try {
      console.log(`start from page ${currentPage}`);
      const response = await axios.get(
        `https://codeforces.com/problemset/page/${currentPage}`
      );

      const $ = cheerio.load(response.data);
      let totalPages = parseInt($(".pagination .page-index").last().text(), 10);
      while (currentPage <= totalPages) {
        console.log(
          `scrapping page ${currentPage}/${totalPages}, ${problems.length} problems so far`
        );
        const pageProblems = await scrapePage(currentPage);
        problems.push(...pageProblems);
        currentPage++;
      }
      resolve(problems);
    } catch (error) {
      let errMessage = `${currentPage} done then An error occurred while scraping:\n\t${error.message}`;
      reject({ message: errMessage, problems });
    }
  });
}

// Function to save the scraped problems in a CSV file
function saveToCSV(problems) {
  if (problems.length == 0) return;
  const csvWriter = createCsvWriter({
    path: "problems.csv",
    header: [
      { id: "id", title: "Problem id" },
      { id: "name", title: "Problem Name" },
      { id: "link", title: "Problem Link" },
      { id: "tags", title: "Tags" },
      { id: "difficulty", title: "difficulty" },
      { id: "solved", title: "solved" }, //number of solved in the list
      { id: "totalSolved", title: "total solved" }, //total number of solved
    ],
  });

  csvWriter
    .writeRecords(problems)
    .then(() =>
      console.log(
        `Scraping completed. ${problems.length} Problems saved to CSV file`
      )
    )
    .catch((error) =>
      console.error("An error occurred while saving to CSV:", error)
    );
}

// Scrape all pages and save to CSV
scrapeAllPages()
  .then((problems) => {
    saveToCSV(problems);
  })
  .catch((err) => {
    console.error(
      "An error occurred:",
      err.message,
      err.problems.length + " problems scraped"
    );
    saveToCSV(err.problems);
  });
