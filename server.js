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
//route to display page from handlebars
app.get("/", function(req, res) {
    //render index in handlebars
    res.render("index", {});
});

//route to get the articles from the website (so include the axios and cheerio items)
//this is called when the user clicks the scrape button
// ******** works *********
app.get("/scrape", function(req, res){
    //axios get to the webpage to scrape
    axios.get("https://ksl.com").then(function(response) {
        //cheerios scraping tools
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //load the headlines/titles, links to database
        $("div.headline").each(function(i, element){
            //empty object to hold each result info (title, link, summary)
            var result = {};
            //save the link and title to the object
            result.title = $(this).children().children("a").text();
            result.link = $(this).children().children("a").attr("href");
            result.summary = $(this).children("h5").text();

            //create new article in the db
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
                return dbArticle;
            }).catch(function(err){
                console.log(err);
            });
        });
        //send the scrape to the client
        res.render("Scrape Completed!");
    });    
});

//get route to display articles page with all the articles with comments
app.get("/articles", function(req, res) {
    //call the articles from the db that were saved after the srape button was hit
    db.Article.find({}).populate("comment").then(function(dbArticle) {
        var dbArticlesObj = {articles: dbArticle}
        res.render("articles", dbArticlesObj);
    }).catch(function(err) {
        res.json(err);
    });
});

//post route to add comments to the selected article
//match to frontend JS on a submit button for comments
//**** working, but overwrites the previous comments, how to get more than one to save to each article?*********
app.post("/article/:id", function(req, res) {
    //take the comment from the front end and add to the db
    db.Comment.create(req.body).then(function(dbComment) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true})
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        });
    });
});

//route for getting a specific article WITH its comments
//match to the front end based on which article div is selected
//**** need to test*********
app.get("/article/:id", function (req, res) {
    //search the article table by the selected id, join with the comment table
    db.Article.findOne({_id: req.params.id}).populate("comment")
    .then(function(dbArticle) {
        // if article is found then return that object
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

//update or delete route to remove comments from the specified article
// ***** need to test***********
app.delete("/comment/:id", function(req, res) {
    //remove the comment from the comments model,
    db.Comment.deleteOne({_id: req.params.id}).then(function(dbComment){
        //then reload the article minus the comment
        //not sure if need the 2nd arguement for comment on this one
        return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true})
    }).then(function(dbArticle){
        //return article
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
    //once posted reload the main page ("/"), showing updated (removed) comments to article
});


//set the server listening
app.listen(PORT, function(){
console.log("Server Listening at http://localhost:" + PORT);
});