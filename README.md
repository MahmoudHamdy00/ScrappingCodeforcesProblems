# ScrappingCodeforcesProblems

This is a project thats extracts codeforces problems to csv files using cheerio.

You can probite a list and extract number of people in this list that solved or tried in the problems.

## How to use

- clone the repository (run this command in the terminal)
  - ```git clone <https://github.com/MahmoudHamdy00/ScrappingCodeforcesProblems.git>```.
- Open the project in VSCode
  - ```cd ScrappingCodeforcesProblems/ && code .```
- Install the required packages
  - ```npm install```
- Run the code
  - ```node .\source.js```

After the execution is done ,you will find **problems.csv** file that has all the problems scraped.

**Note that codeforces might prevent you from access the site after some requests, so wait somee minutes and then un the code again, but modify the starting page that will pe scraped to the last page that scraped successfully in the last run, but don't forget to change the previous csv file so that it's not overwritten.**

*Finally i would like to receive feedback and also contribution are very welcomed.*
