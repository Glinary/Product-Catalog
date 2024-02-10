// ---------- Dependencies #1 ---------- //
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");

// ---------- Dependencies #1 ---------- //

// ---------- Dependencies #2 ---------- //
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const sheetId = process.env.SHEET_ID;
const tabName = 'Sheet1';
const range = 'A:B';

// Get the content from the .env file
require("dotenv").config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ---------- Dependencies #2 ---------- //

// Set views folder to 'public' for accessibility
app.use("/static", express.static("public"));


// State hbs as view engine and views folder for views
app.engine("hbs", exphbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

// --------- EMAIL COLLECTOR SECTION ---------- //

async function getGoogleSheetClient() {
  try {
    const keyFilePath = path.join(__dirname, 'credentials.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const authClient = await auth.getClient();
    return google.sheets({
      version: "v4",
      auth: authClient,
    });
  } catch (error) {
    console.error("Error while getting google sheet client:", error);
  }
  
}

// Append new data to Google Sheet
async function writeGoogleSheet(
  googleSheetClient,
  sheetId,
  tabName,
  range,
  data
) {

  try {
    console.log("Appending data to range:", range); // Log the range
    console.log(data);
    await googleSheetClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        majorDimension: "ROWS",
        values: data,
      },
    });
  } catch (error) {
    console.error("Error while appending new data to google sheet:", error);
  }
  
}


// Call the function to store Email in Google Sheet using Google API
async function storeEmail(name, email) {
  try {
    let client = await getGoogleSheetClient();
    let data = [[name, email]];
    await writeGoogleSheet(client, sheetId, tabName, range, data);
  } catch (error) {
    console.error("Error while storing email in google sheet:", error);
  }
  
}

// --------- EMAIL COLLECTOR SECTION ---------- //

// ---------- ROUTES SECTION ---------- //

app.get("/", (req, res) => {
    res.render("index", {
        title: "Laija | Home",
    script1: "static/js/bootstrap.bundle.min.js",
    script2: "static/js/tiny-slider.js",
    script3: "static/js/custom.js",
    css1: "static/css/bootstrap.min.css",
    css2: "static/css/tiny-slider.css",
    css3: "static/css/style.css",
    pic1: "static/assets/RG-Clover-Premium.jpg",
    pic2: "static/assets/silverbutterfly.jpg",
    pic3: "static/assets/goldrose.jpg",
    emailpic: "static/assets/envelope-outline.svg",
    });
});

app.get("/about", (req, res) => {

    res.render("about", {
      title: "Laija | About us",
      script1: "static/js/bootstrap.bundle.min.js",
      script2: "static/js/tiny-slider.js",
      script3: "static/js/custom.js",
      css1: "static/css/bootstrap.min.css",
      css2: "static/css/tiny-slider.css",
      css3: "static/css/style.css",
      emailpic: "static/assets/envelope-outline.svg",
      grouppic: "static/assets/grouppic.jpg"
    });
  });

  app.get("/shop",(req, res) => {

    res.render("shop", {
      title: "Laija | Products",
      script1: "static/js/bootstrap.bundle.min.js",
      script2: "static/js/tiny-slider.js",
      script3: "static/js/custom.js",
      css1: "static/css/bootstrap.min.css",
      css2: "static/css/tiny-slider.css",
      css3: "static/css/style.css",
      pic1: "static/assets/goldbutterfly.jpg",
      pic2: "static/assets/goldrose.jpg",
      pic3: "static/assets/silverbutterfly.jpg",
      pic4: "static/assets/silvergempremium.jpg",
      pic5: "static/assets/silverhearts.jpg",
      pic6: "static/assets/silverrose.jpg",
      pic7: "static/assets/silverstar.jpg",
      pic8: "static/assets/RG-Clover-Premium.jpg",
      pic9: "static/assets/Amor.JPG",
      pic10: "static/assets/Sinta.JPG",
      pic11: "static/assets/pads.jpg",
      pic12: "static/assets/pads.jpg",
      pic13: "static/assets/charms.jpg",
      pic14: "static/assets/charms.jpg",
      pic15: "static/assets/charms.jpg",
      pic16: "static/assets/charms.jpg",
      emailpic: "static/assets/envelope-outline.svg",
    });
  });

app.post("/storeEmail", (req, res) => {
  let { name, email } = req.body;
  // Assuming storeEmail is defined elsewhere and returns a promise
  storeEmail(name, email)
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.error("Error storing email:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});



app.use(express.json());


// ---------- ROUTES SECTION ---------- //

// intercept all requests with the content-type, application/json
//app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Set listener to port 3000
app.listen(3000, () => console.log("Express app is now listening..."));