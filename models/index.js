//export the object of tables/models from the other models .js files to the server.js file

module.exports = {
    Article: require("./Article"),
    Comment: require("./Comment")
};