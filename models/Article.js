//articles model that will get all the scraped articles and the comments entered by users
var mongoose = require("mongoose");

//save a reference to schema constructor
var Schema = mongoose.Schema;

//schema contructor for our table
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

//creates the actual model from schema above
var Article = mongoose.model("Article", ArticleSchema);

//export model to the models/index.js
module.exports = Article;