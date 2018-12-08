$(document).ready(function(){
    //initializations for materialize ===================================
    $(".collapsible").collapsible();
    $(".modal").modal();

    // on click events ==================================================
    $("#scrape").on("click", function(event){
        event.preventDefault();
        $.get("/scrape", function(dbArticle){
            // console.log("scraped ", dbArticle);
            location.reload();
        }); 
    });

    $(".addComment").on("click", function(event) {
        event.preventDefault();
        //get the id for the article off of the add comment button clicked
        var articleId = $(this).attr("data-id");
        //validate there is at least one character
        if ($("#commentText" + articleId).val() === "") {
            $("#commentError").modal("open");
        }
        else {
            var commentObj = {
                body: $("#commentText" + articleId).val().trim()
            };

            //testing
            // console.log("commentObj: ", JSON.stringify(commentObj, null, 2));
            // console.log("article id ", articleId);

            //run post method to save to the db>comments table
            $.post("/" + articleId, commentObj, function(dbArticle){
                console.log(dbArticle, commentObj);
                location.reload();
            });
        };
    });

    $(".delete").on("click", function(event) {
        event.preventDefault();
        var commentId = $(this).attr("data-id");
        $.ajax({
            method: "DELETE",
            url: "/" + commentId
        }).then(function() {
            location.reload();
        });
    });
});