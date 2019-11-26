const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require('dynamic-html-pdf');

inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username",
    stars: "stars"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

    axios.get(queryUrl).then(function(res) {
      const repoNames = res.data.map(function(repo) {
        return repo.name;
      });

      const repoNamesStr = repoNames.join("\n");
    
    axios.get(queryUrl).then(function(res) {
      const starStr = res.data.map(function(repo) {
        return repo.name;
      });

      const starTotalStr = starStr.join("\n");

      fs.writeFile("profile.txt", repoNamesStr, starTotalStr, function(err) {
        if (err) {
          throw err;
        }

        console.log(`Saved ${repoNames.length} repos and ${starStr.length}`);
      });
    });
  });

});

  // pdf.create(document, options)