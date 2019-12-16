const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const puppeteer = require("puppeteer");

const generateHTML = require("./generateHTML");

let writeFileAsync = util.promisify(fs.writeFile);

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
      message: "What is your Github user name?",
      name: "username"
    },
    {
      type: "list",
      message: "Which of these is your favorite color?",
      name: "color",
      choices: ["blue", "red", "pink", "green"]
    }
  ])

  .then(function({username, color}) {
    //Calls GitHub API of a user
    const queryUrl = `https://api.github.com/users/${username}`;
    return axios.get(queryUrl).then(function(res) {

      //Calls GitHub API for the users stars
      const starDataUrl = `https://api.github.com/users/${username}/starred`;
      axios.get(starDataUrl).then(function(stars) {

        if (res.data.bio === null) {
          res.data.bio = `<h3 class = "userBio">${username}, "does not yet have a Bio on GitHub."</h3>`;
        }
        if (res.data.blog === "") {
          res.data.blog = `<h3 class = "userBlog">${username}, "does not yet have a Blog on GitHub."</h3>`;
        }
        if (res.data.location === null) {
          res.data.location = `<h3 class = "userLocation">${username}, "has not yet added their location on GitHub."</h3>`;
        }

        //Data object
        data = {
          img: res.data.avatar_url,
          username: res.data.login,
          location: res.data.location,
          profile: res.data.url,
          blog: res.data.blog,
          bio: res.data.bio,
          repos: res.data.public_repos,
          followers: res.data.followers,
          following: res.data.following,
          stars: stars.data.length,
          color: color
        };


        generateHTML(data);
        writeToHTML(generateHTML(data));
        makePdf(username);
        console.log("New profile created successfully!");

    });
  });
});
}

const writeToHTML = function(generateHTML){
  writeFileAsync("index.html", generateHTML);
  }
      
  init();
      
  async function makePdf(username){
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
    };