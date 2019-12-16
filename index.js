const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const puppeteer = require("puppeteer");

let writeFileAsync = util.promisify(fs.writeFile);

const colors = {
    green: {
      wrapperBackground: "#E6E1C3",
      headerBackground: "#C1C72C",
      headerColor: "black",
      photoBorderColor: "#black"
    },
    blue: {
      wrapperBackground: "#5F64D3",
      headerBackground: "#26175A",
      headerColor: "white",
      photoBorderColor: "#73448C"
    },
    pink: {
      wrapperBackground: "#879CDF",
      headerBackground: "#FF8374",
      headerColor: "white",
      photoBorderColor: "#FEE24C"
    },
    red: {
      wrapperBackground: "#DE9967",
      headerBackground: "#870603",
      headerColor: "white",
      photoBorderColor: "white"
    }
  };

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
        console.log("New rofile created successfully!");

        });
      });
    });

    function generateHTML(data) {
      return `<!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
          <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
          <title>Document</title>
          <body>
          <div class="wrapper">
            <div class="row">
              <div class="col">
                <div class="card">
                  <h2>Github stars</h2>
                  <h3>${data.stars}</h3>
                </div>
              </div>
            </div>
          </div>  
          </body>
          <style>
              @page {
                margin: 0;
              }
             *,
             *::after,
             *::before {
             box-sizing: border-box;
             }
             html, body {
             padding: 0;
             margin: 0;
             }
             html, body, .wrapper {
             height: 100%;
             }
             .wrapper {
             background-color:${colors[data.color].wrapperBackground};
             padding-top: 100px;
             }
             body {
             background-color: white;
             -webkit-print-color-adjust: exact !important;
             font-family: 'Cabin', sans-serif;
             }
             main {
             background-color: #E9EDEE;
             height: auto;
             padding-top: 30px;
             }
             h1, h2, h3, h4, h5, h6 {
             font-family: 'BioRhyme', serif;
             margin: 0;
             }
             h1 {
             font-size: 3em;
             }
             h2 {
             font-size: 2.5em;
             }
             h3 {
             font-size: 2em;
             }
             h4 {
             font-size: 1.5em;
             }
             h5 {
             font-size: 1.3em;
             }
             h6 {
             font-size: 1.2em;
             }
             .photo-header {
             position: relative;
             margin: 0 auto;
             margin-bottom: -50px;
             display: flex;
             justify-content: center;
             flex-wrap: wrap;
             background-color:${colors[data.color].headerBackground} ;
             color:${colors[data.color].headerColor};
             padding: 10px;
             width: 95%;
             border-radius: 6px;
             }
             .photo-header img {
             width: 250px;
             height: 250px;
             border-radius: 50%;
             object-fit: cover;
             margin-top: -75px;
             border: 6px solid ${colors[data.color].photoBorderColor};
             box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
             }
             .photo-header h1, .photo-header h2 {
             width: 100%;
             text-align: center;
             }
             .photo-header h1 {
             margin-top: 10px;
             }
             .links-nav {
             width: 100%;
             text-align: center;
             padding: 20px 0;
             font-size: 1.1em;
             }
             .nav-link {
             display: inline-block;
             margin: 5px 10px;
             }
             .workExp-date {
             font-style: italic;
             font-size: .7em;
             text-align: right;
             margin-top: 10px;
             }
             .container {
             padding: 50px;
             padding-left: 100px;
             padding-right: 100px;
             }
    
             .row {
               display: flex;
               flex-wrap: wrap;
               justify-content: space-between;
               margin-top: 20px;
               margin-bottom: 20px;
             }
    
             .card {
               padding: 20px;
               border-radius: 6px;
               background-color:${colors[data.color].headerBackground};
               color:${colors[data.color].headerColor};
               margin: 20px;
             }
             
             .col {
             flex: 1;
             text-align: center;
             }
    
             a, a:hover {
             text-decoration: none;
             color: inherit;
             font-weight: bold;
             }
    
             @media print { 
              body { 
                zoom: .75; 
              } 
             }
          </style>
            }
    </html>`
};
    const writeToHTML = function(generateHTML){
    writeFileAsync("index.html", generateHTML, err => {
      if (err) {
        console.log("File Not Created Successfully");
      } else {
        console.log("File Created Successfully");
      }
    });
};