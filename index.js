const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");

const generateHTML = require("./generateHTML");

const writeFileAsync = util.promisify(fs.writeFile);


let img = "";
let location = "";
let gitProfile = "";
let userBlog = "";
let userBio = "";
let repoNum = 0;
let followers = 0;
let following = 0;
let starNum = 0;
let color = "";

function init() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter your GitHub username",
        name: "username"
      },
      {
        type: "input",
        message: "Which color would you like? green/red/pink/blue?",
        name: "color"
      }
    ])
    .then(function({ username, color }) {
      const config = { headers: { accept: "application/json" } };
      let queryUrl = ` https://api.github.com/users/${username}`;
      return axios.get(queryUrl, config).then(userData => {
        let newUrl = `https://api.github.com/users/${username}/starred`;
      

        axios.get(newUrl, config).then(starredRepos => {
          data = {
            img: userData.data.avatar_url,
            location: userData.data.location,
            gitProfile: userData.data.html_url,
            userBlog: userData.data.blog,
            userBio: userData.data.bio,
            repoNum: userData.data.public_repos,
            followers: userData.data.followers,
            following: userData.data.following,
            starNum:starredRepos.data.length,
            username: username,
            color: color
          };
           generateHTML(data);
           writeHTML(generateHTML(data));
           makePdf(username);
           
        });
      });
    });
}

const writeHTML = function(generateHTML){
writeFileAsync("index.html", generateHTML);
}

 init();

 async function makePdf(username){
  // console.log(username);
    try {
   
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

  await page.goto('file:///Users/peterrydell/Homework/profile-generator/index.html');
    await page.emulateMedia("screen");
    await page.pdf({ 
      path: `${username}.pdf`,
      format: "A4",
      printBackground: true,
      landscape: false
    });
    
    console.log("Succesfully generated PDF");
    await browser.close();
  } catch (error) {
  console.log("Error generating PDF");
  }
}
