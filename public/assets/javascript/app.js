$(document).ready(function(){
    //initializations for materialize
    $(".collapsible").collapsible();

    //on click to scrape articles
    $("#scrape").on("click", function(event){
        event.preventDefault();
        //call to the server file to initiate the scrape
        $.get("/scrape", function(data){
            //its not logging the console or reloading page, but you can do a manual refresh and the articles are there
            console.log("scraped ", data) 
            location.reload();  
        });
        // $("#container").load("/", "#articleDisplay", function() {
        //     console.log("page was loaded");
            
        // });
        // location.reload();
    });


    //on click for add comment button
    $(".addComment").on("click", function(event) {
        event.preventDefault();
        // get the value of the text area (only working for first box) rest are blank with the correct article ID
        var commentObj = {
            // if I do "this" it is always blank
            body: $(".commentText").val().trim()
        };
        //get the id for the article off of the save button clicked
        var articleId = $(this).attr("data-id");
        console.log("commentObj: ", JSON.stringify(commentObj, null, 2));
        console.log("article id ", articleId);

        //run post method to save to the db>comments table
        $.post("/" + articleId, commentObj, function(dbArticle){
            console.log(dbArticle, articleId, commentObj); //shows the article db item
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