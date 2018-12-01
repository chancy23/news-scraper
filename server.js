//load all the required npms

//link to the models as var db

//get route to display the home page

//post route to add comments to the selected article

//update or delete route to remove comments


//set the server listening


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);