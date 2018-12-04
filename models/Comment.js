//comments model that will be tied to the articles model

var mongoose = require("mongoose");

//ref to the mongoose schema constructor
var Schema = mongoose.Schema;

//create schema object for this model
var CommentSchema = new Schema ({
    body: String,
});

//create model from schema
var Comment = mongoose.model("Comment", CommentSchema);

//export model to be used by index.js file
module.exports = Comment;