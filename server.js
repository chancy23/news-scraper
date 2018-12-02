//load all the required npms
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//link to the models as var db
var db = require("./models");

//set up server and initialize express
var PORT = process.env.PORT || 3000;
var app = express();


// middleware ==================================================
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//set up handlbars ============================================+
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArticleScraper" 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//routes===========================================================
//route to get the articles from the website (so include the axios and cheerio items)
app.get("/scrape", function(req, res){
    //axios get to the webpage to scrape
    axios.get("https://ksl.com").then(function(response) {
        //cheerios scraping tools
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //load the headlines/titles, links to database
        $("div.headline").each(function(i, element){
            //empty object to hold each result pair (title, link)
            var result = {};
            //save the link and title to the object
            result.title = $(this).children().children("a").text();
            result.link = $(this).children().children("a").attr("href");
            // console.log(JSON.stringify(result, null, 2));

            //create new article in the db
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
        });
        //send the scrape to the client
        res.send("scrape completed");
        //make sure there are no duplicates
        //only load new articles not every article
    })
          
});

//get route to display the home page display all the articles 
app.get("/articles", function(req, res) {
    //call the articles from teh db that were saved after the srape button was hit
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

//post route to add comments to the selected article
app.post("/api/comments", function(req, res){

    //once posted reload the main page ("/"), showing comments to article
});

//update or delete route to remove comments
app.delete("/api/comments", function(req, res){

    //once posted reload the main page ("/"), showing updated (removed) comments to article
});


//set the server listening
app.listen(PORT, function(){
console.log("Server Listening at http://localhost:" + PORT);
});