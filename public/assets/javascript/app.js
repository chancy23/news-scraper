$(document).ready(function(){
    //initializations for materialize
    $(".collapsible").collapsible();

    //on click to scrape articles
    $("#scrape").on("click", function(event){
        event.preventDefault();
        //call to the server file to initiate the scrape/rescrape
        $.get("/scrape", function(dbArticle){
            //its not logging the console or reloading page, but you can do a manual refresh and the articles are there
            console.log("scraped ", dbArticle);
            location.reload();
        }); 
    });


    //on click for add comment button
    $(".addComment").on("click", function(event) {
        event.preventDefault();
        //get the id for the article off of the add comment button clicked
        var articleId = $(this).attr("data-id");
        var commentObj = {
            body: $("#commentText" + articleId).val().trim()
        };

        //testing
        // console.log("commentObj: ", JSON.stringify(commentObj, null, 2));
        // console.log("article id ", articleId);

        //run post method to save to the db>comments table
        $.post("/" + articleId, commentObj, function(dbArticle){
            console.log(dbArticle, commentObj); //shows the article db item
            //then push the comment to the display section on page reload
            location.reload();
        });
    });

    //on click for delete button
    $(".delete").on("click", function(event) {
        event.preventDefault();
        var commentId = $(this).attr("data-id");
        console.log("comment id to delete ", commentId);
        //send the id to the delete method in the server.js to remove from comments model
        $.ajax({
            method: "DELETE",
            url: "/" + commentId
        }).then(function(data) {
            console.log("data ", data);
            //reload the page to update comment section
            location.reload();
        });
    });













});