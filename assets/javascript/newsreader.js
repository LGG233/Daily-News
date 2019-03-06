var searchText = "";
var topics = ["France", "China", "Europe", "Japan", "Cycling", "Wine", "Ohio", "Minnesota"];
var sujets = ["France", "Chine", "Europe", "Japon", "Cyclisme", "Vin", "Ohio", "Minnesota"];
var language = "English";
var articleSearch = "";

$(document).ready(function () {
    renderButtons();
    getArticles();
    frenchChooser();
    englishChooser();
    addSearchButton();
});

function renderButtons() {
    $("#button-space").empty();
    if (language === "English") {
        for (var i = 0; i < topics.length; i++) {
            var a = $("<button>");
            a.addClass("button-text");
            a.addClass("btn-primary");
            a.attr("data-name", topics[i]);
            a.text(topics[i]);
            $("#button-space").append(a);
        }
    } else {
        for (var i = 0; i < sujets.length; i++) {
            var a = $("<button>");
            a.addClass("button-text");
            a.addClass("btn-primary");
            a.attr("data-name", sujets[i]);
            a.text(sujets[i]);
            $("#button-space").append(a);
        }
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
    })
}

function frenchChooser() {
    $("#french").on("click", function () {
        language = "French";
        $("#main-title").text("Toutes Les Nouvelles Dont Vous Avez Besoin");
        $("#sub-title").html("Abonnement obligatoire à <em>Libération</em> pour lire les articles");
        $("#instructions").html("Cliquez un sujet pour voir jusqu'à dix articles de <em>Libération</em> à ce sujet");
        $("#search-input").html("<span id='search-input'><strong>Que désirez-vous voir de plus?</strong><input id='searchText' type='text'>");
        $("#add-button").html("On y va !");
        $("#articles-space").empty();
        $("#articles-title").empty();
        renderButtons(sujets);
        getArticles();
    })
};

function englishChooser() {
    $("#english").on("click", function () {
        language = "English";
        $("#main-title").text("All The News That's Fit To Read");
        $("#sub-title").html("<em>New York Times</em> subscription required");
        $("#instructions").html("Click a button to get up to ten articles on that topic from the <em>New York Times</em>");
        $("#search-input").html("<span id='search-input'><strong>What else do you want to read?</strong><input id='searchText' type='text'>");
        $("#add-button").html("Takeoff!");
        $("#articles-space").empty();
        $("#articles-title").empty();
        renderButtons(topics);
        getArticles();
    })
};

function getArticles() {
    $(".button-text").on("click", function () {
        articleSearch = $(this).attr("data-name");
        console.log(articleSearch)
        if (language === "English") {
            engArticleSearch();
        } else {
            frenArticleSearch();
        }
    })
}


function engArticleSearch() {
    console.log(articleSearch);
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
}

function frenArticleSearch() {
    console.log(articleSearch);
    var queryURL = "https://newsapi.org/v2/everything?q=" + articleSearch + "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            $("#articles-space").empty();
            $("#articles-title").html("<h1>Voici vos articles au sujet de " + articleSearch + ". Bonne lecture !</h1>");
            for (var j = 0; j < 10; j++) {
                var articlesDiv = $("<span class='article'>");
                var title = $("<p>").html("<h2><a target='_blank' href='" + response.articles[j].url + "'>" + response.articles[j].title + "</a></h2>");
                var byline = $("<p>").html("<h5>" + response.articles[j].author + "</h5>");
                var blurb = $("<p>").html("<h4>" + response.articles[j].content + "</h4><br>");
                articlesDiv.append(title);
                articlesDiv.append(byline);
                articlesDiv.append(blurb);
                $("#articles-space").prepend(articlesDiv);
            };
        });
}

