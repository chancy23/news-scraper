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
//this is called when the user clicks the scrape button
app.get("/scrape", function(req, res){
    //axios get to the webpage to scrape
    axios.get("https://ksl.com").then(function(response) {
        //cheerios scraping
        var $ = cheerio.load(response.data);
        $("div.headline").each(function(i, element){
            //empty object to hold each result info (title, link, summary)
            var result = {};
            result.title = $(this).children().children("a").text();
            result.link = $(this).children().children("a").attr("href");
            result.summary = $(this).children("h5").text();

            //check if article already exists in our db
            db.Article.find({title: result.title}).exec(function(err, doc){
                if(doc.length) {
                    console.log("Article Already Exists");
                    //stops the server call once check is done(however only loads one new article if there are more than one, when placed here)
                    // res.end();
                }
                else {
                    //create new article in the db
                    db.Article.create(result).then(function(dbArticle){
                        console.log(dbArticle);
                        //this allows the page to refresh after scrape and all new articles display, but am getting an error in terminal???
                        //Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
                        res.json(dbArticle); 
                    }).catch(function(err){
                        console.log(err);
                    });
                    //doesn't do anything here
                    // res.end();
                }
            });
        });
    });    
});

app.get("/", function(req, res) {
    //call the articles from the db that were saved after the srape button was hit
    db.Article.find({}).populate("comment").then(function(dbArticle) {
        var dbArticlesObj = {articles: dbArticle}
        res.render("index", dbArticlesObj);
    }).catch(function(err) {
        res.json(err);
    });
});

//**** working, but overwrites the previous comments, how to get more than one to save to each article?*********
app.post("/:articleId", function(req, res) {
    console.log("Comment", req.body);
    //take the comment from the front end and add to the db
    db.Comment.create(req.body).then(function(dbComment) {
        return db.Article.findOneAndUpdate({_id: req.params.articleId}, {comment: dbComment._id}, {new: true})
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        });
    });
});

app.delete("/:commentId", function(req, res) {
    //remove the comment from the comments model,
    db.Comment.deleteOne({_id: req.params.commentId}).then(function(dbComment){
        //then return the article, updated
        return db.Article.findOneAndUpdate({_id: req.params.id}, {new: true})
    }).then(function(dbArticle){
        // send the article back to the front end
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

//set the server listening
app.listen(PORT, function(){
console.log("Server Listening at http://localhost:" + PORT);
});