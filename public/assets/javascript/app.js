$(document).ready(function(){
    //initializations for materialize
    $(".collapsible").collapsible();

    //on click to scrape articles
    $(".scrape").on("click", function(event){
        event.preventDefault();
        //call to the server file to initiate the scrape
        $.get("/scrape", function(data){
            console.log("scraped ", data) 
            // return data;  
        });
        //load the articles page after scrape (need to verify it is finishing the scrap first)
        location.href= "/articles";  
    });


    //on click for add comment button
    $(".addComment").on("click", function(event) {
        event.preventDefault();
        // get the value of the text area (only working for first box)
        var commentObj = {
            comment: $(".commentText").val().trim()
        };
        //get the id for the article off of the save button
        var articleId = $(this).attr("id");
        console.log("commentObj: ", JSON.stringify(commentObj, null, 2));
        console.log("article id ", articleId);
        //run post method to save to the db>comments table
        $.post("/article/" + articleId, commentObj, function(dbArticle){
            console.log(dbArticle); //shows the article db item
            //then push the comment to the display section
        });
    });

    //on click for delete button













});