var searchText = "";
var topics = ["France", "China", "Europe", "Japan", "Cycling", "Wine", "Ohio", "Minnesota"];
renderButtons();
getArticles();

$(document).ready(function () {
    $("#add-button").on("click", function (event) {
        event.preventDefault();
        searchText = $("#searchText").val().trim();
        $("#searchText").text("");
        topics.push(searchText);
        renderButtons();
        getArticles();
    })
});

function renderButtons() {
    $("#button-space").empty();
    for (var i = 0; i < topics.length; i++) {
        var a = $("<button>");
        a.addClass("button-text");
        a.addClass("btn-primary");
        a.attr("data-name", topics[i]);
        a.text(topics[i]);
        $("#button-space").append(a);
    }
}

function getArticles() {
    $(".button-text").on("click", function () {
        articleSearch = $(this).attr("data-name");
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + articleSearch + "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                $("#articles-space").empty();
                $("#articles-title").html("<h1>Here are your articles on " + articleSearch + ". Enjoy!</h1>");
                for (var j = 0; j < 10; j++) {
                    var articlesDiv = $("<span class='article'>");
                    var title = $("<p>").html("<h2><a target='_blank' href='" + response.response.docs[j].web_url + "'>" + response.response.docs[j].headline.main + "</a></h2>");
                    var byline = $("<p>").html("<h5>" + response.response.docs[j].byline.original + "</h5>");
                    var blurb = $("<p>").html("<h4>" + response.response.docs[j].lead_paragraph + "</h4><br>");
                    articlesDiv.append(title);
                    articlesDiv.append(byline);
                    articlesDiv.append(blurb);
                    $("#articles-space").prepend(articlesDiv);
                };
            });
    })
};
