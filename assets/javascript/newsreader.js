var topics = ["France", "China", "Europe", "Japan", "Cycling", "Wine", "Ohio", "Minnesota"];
var sujets = ["France", "Chine", "Europe", "Japon", "Cyclisme", "Vin", "Ohio", "Minnesota"];
var language = "English";
var searchText = "";
var articleSearch = "";
var searchDB = [];
var engSearch = ["response.response.docs", "web_url", "headline.main", "byline.original", "lead_paragraph"];
var frenSearch = ["response.articles", "url", "title", "author", "content"];
searchDB = engSearch; // set english as default


$(document).ready(function () {
    console.log("I'm ready!");
    renderButtons();
    getArticles(engSearch);
    langChooser();
    addSearchButton();
    frenchify();
    englishify();
});

function frenchify() {
    $("#main-title").text("Toutes Les Nouvelles Dont Vous Avez Besoin");
    $("#reading").html("<br><br>Ces articles viennent de <em>Libération</em>. Abonnement obligatoire");
    $("#lang-lead").html("Cliquez un sujet pour voir jusqu'à dix articles de <em>Libération</em> à ce sujet");
    $("#search-input").html("<span id='search-input'><strong>Que désirez-vous voir de plus?</strong><input id='searchText' type='text'>");
    $("#add-button").html("On y va !");
    $("#articles-space").empty();
    $("#articles-title").empty();
}

function englishify() {
    $("#main-title").text("All The News That's Fit To Read");
    $("#reading").html("<br><br>Articles come from <em>The New York Times</em>. Subscription required");
    $("#lang-lead").html("Click a button to get up to ten articles on that topic from the <em>New York Times</em>");
    $("#search-input").html("<span id='search-input'><strong>What else do you want to read?</strong><input id='searchText' type='text'>");
    $("#add-button").html("Let's go!");
    $("#articles-space").empty();
    $("#articles-title").empty();
}


function renderButtons() {
    $("#button-space").empty();
    if (language === "English") {
        var database = topics
    } else {
        var database = sujets
    }
    for (var i = 0; i < database.length; i++) {
        var a = $("<button>");
        a.addClass("button-text", "btn-info");
        a.attr("data-name", database[i]);
        a.text(database[i]);
        $("#button-space").append(a);
    }
}

function addSearchButton() {
    $("#add-button").on("click", function (event) {
        event.preventDefault();
        searchText = $("#searchText").val().trim();
        $("#searchText").text("");
        if (language === "English") {
            topics.push(searchText);
        } else {
            sujets.push(searchText);
        }
        renderButtons();
        getArticles();
    })
}

function langChooser() {
    $(".lang-btn").on("click", function () {
        var pickedLanguage = $(this).attr("data-name");
        console.log(pickedLanguage);
        if (pickedLanguage === "English") {
            language = "English";
            englishify();
            renderButtons(topics);
        } else {
            language = "French";
            frenchify();
            renderButtons(sujets);
        }
        getArticles();
    })
}


function getArticles() {
    console.log("getArticles is running");
    $(".button-text").on("click", function () {
        articleSearch = $(this).attr("data-name");
        // console.log("this should be the search text - articleSearch: " + articleSearch);
        if (language === "English") {
            queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + articleSearch + "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy"
            // console.log(queryURL);
            $("#articles-title").html("<h3>Here are your articles on " + articleSearch + ". Enjoy!</h3>");
            engArticleSearch();
            // searchDB = engSearch;
        } else {
            queryURL = "https://newsapi.org/v2/everything?q=" + articleSearch + "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
            // searchDB = frenSearch;
            $("#articles-title").html("<h3>Voici vos articles au sujet de " + articleSearch + ". Bonne lecture !</h3>");
            frenArticleSearch();
        }
    }
    )
};

function engArticleSearch() {
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + articleSearch + "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            $("#articles-space").empty();
            $("#articles-title").html("<h3>Here are your articles on " + articleSearch + ". Enjoy!</h3>");
            for (var j = 0; j < 10; j++) {
                var myText = $("<div class='col-lg-12'></div>");
                var articlesDiv = $("<div class='card article'>");
                var title = $("<p class='card title'>").html("<h6><a target='_blank' href='" + response.response.docs[j].web_url + "'>" + response.response.docs[j].headline.main + "</a></h6>");
                var byline = $("<p class='card-text'>").html(response.response.docs[j].byline.original);
                var blurb = $("<p class='card-text'>").html(response.response.docs[j].lead_paragraph);
                articlesDiv.append(title);
                articlesDiv.append(byline);
                articlesDiv.append(blurb);
                articlesDiv.appendTo(myText);
                $("#articles-space").prepend(myText);
            };
        });
}


function frenArticleSearch() {
    var queryURL = "https://newsapi.org/v2/everything?q=" + articleSearch + "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            $("#articles-space").empty();
            $("#articles-title").html("<h3>Voici vos articles au sujet de " + articleSearch + ". Bonne lecture !</h3>");
            for (var j = 0; j < 10; j++) {
                var myText = $("<div class='col-lg-12'></div>");
                var articlesDiv = $("<div class='card article'>");
                var title = $("<p class='card title'>").html("<h6><a target='_blank' href='" + response.articles[j].url + "'>" + response.articles[j].title + "</a></h6>");
                var byline = $("<p class='card-text'>").html(response.articles[j].author);
                var blurb = $("<p class='card-text'>").html(response.articles[j].content);
                articlesDiv.append(title);
                articlesDiv.append(byline);
                articlesDiv.append(blurb);
                articlesDiv.appendTo(myText);
                $("#articles-space").prepend(myText);
            };
        });
};
        //         $.ajax({
        //             url: queryURL,
        //             method: "GET"
        //         })
        //             .then(function (response) {
        //                 console.log(response)
        //                 var jLead = searchDB[0];
        //                 var jURL = searchDB[1];
        //                 var jHead = searchDB[2];
        //                 var jByline = searchDB[3];
        //                 var jBlurb = searchDB[4];
        //                 console.log(response + "." + jLead[8] + "." + jHead)
        //                 $("#articles-space").empty();
        //                 for (var j = 0; j < 10; j++) {
        //                     var articlesDiv = $("<span class='article'>");
        //                     var articleTitle = $("<p>").html("<h4><a target='_blank' href=" + jLead[j].jURL + ">" + jLead[j].jHead + "</a></h4>");
        //                     var articleByline = $("<p>").html(jLead[j].jByline);
        //                     var articleBlurb = $("<p>").html(jLead[j].jBlurb);
        //                     articlesDiv.append(articleTitle, articleByline, articleBlurb);
        //                     $("#articles-space").prepend(articlesDiv);
        //                 };
        //             });
        //     })
        // }
        //     // var opening = "<h31>Here are your articles on " + articleSearch + ". Enjoy!</h31>";
        //     // var jLead = "response.response.docs";
        //     // var jURL = "web_url";
        //     // var jHead = "headline.main";
        //     // var jByline = "byline.original";
        //     // var jBlurb  = "lead_paragraph";
        //     // var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + articleSearch + "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
        // } else {
        //     var opening = "<h3>Voici vos articles au sujet de " + articleSearch + ". Bonne lecture !</h3>";
        //     var jLead = "response.articles";
        //     var jURL = "url";
        //     var jHead = "title";
        //     var jByline = "author";
        //     var jBlurb  = "content";
        //     var queryURL = "https://newsapi.org/v2/everything?q=" + articleSearch + "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
        // }

