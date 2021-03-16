var topics = [
  "France",
  "China",
  "Europe",
  "Japan",
  "Cycling",
  "Wine",
  "Ohio",
  "Minnesota",
];
var sujets = [
  "France",
  "Chine",
  "Europe",
  "Japon",
  "Cyclisme",
  "Vin",
  "Ohio",
  "Minnesota",
];
var language = "English";
var searchText = "";
var articleSearch = "";
var searchDB = [];
var myText = $("<div class='card-columns'></div>");

$(document).ready(function () {
  renderButtons();
  getArticles();
  langChooser();
  addSearchButton();
  frenchify();
  englishify();
  engStartup();
});

function frenchify() {
  $("#main-title").text("Les Nouvelles");
  $("#reading").html(
    "Ces articles viennent de <em>Libération</em>. Abonnement obligatoire."
  );
  $("#searchBar").text("Recherche");
  $("#search-input").html(
    "<span id='search-input'><strong>Nouvelle recherche</strong><input id='searchText' type='text'>"
  );
  $("#add-button").html("Ajouter");
  $("#articles-space").empty();
  $("#articles-title").empty();
}

function englishify() {
  $("#main-title").text("The News");
  $("#reading").html(
    "All articles come from <em>The New York Times</em>. Subscription required."
  );
  $("#searchBar").text("Search");
  $("#search-input").html(
    "<span id='search-input'><strong>New search</strong><input id='searchText' size='15' type='text'>"
  );
  $("#add-button").html(
    "<button class='btn btn-primary' id='add-button' type='submit'>Add search"
  );
  $("#articles-space").empty();
  $("#articles-title").empty();
}
function renderButtons() {
  $("#button-space").empty();
  if (language === "English") {
    var database = topics;
  } else {
    var database = sujets;
  }
  for (var i = 0; i < database.length; i++) {
    var a = $("<button>");
    a.addClass("btn");
    a.addClass("btn-primary");
    a.addClass("search-button");
    a.attr("type", "button");
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
    var articleSearch = searchText;
    if (language === "English") {
      topics.push(searchText);
      // console.log(articleSearch);
      // engArticleSearch(articleSearch);
      var queryURL =
        "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
        articleSearch +
        "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
      console.log(articleSearch);
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        console.log("let's clear out the articles-space");
        myText = $("<div class='card-columns'></div>"); // reset div with articles
        for (var j = 0; j < 10; j++) {
          var headline = response.response.docs[j].headline.main;
          var url = response.response.docs[j].web_url;
          var author = response.response.docs[j].byline_original;
          var content = response.response.docs[j].lead_paragraph;
          renderHTML(url, headline, author, content);
        }
      });
    } else {
      sujets.push(searchText);
      var queryURL =
        "https://newsapi.org/v2/everything?q=" +
        articleSearch +
        "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        myText = $("<div class='card-columns'></div>"); // reset div with articles
        for (var j = 0; j < 10; j++) {
          var headline = response.articles[j].title;
          var url = response.articles[j].url;
          var author = response.articles[j].author;
          var content = response.articles[j].content;
          renderHTML(url, headline, author, content);
        }
      });
    }
    renderButtons();
    getArticles();
  });
}

function langChooser() {
  $(".lang-btn").on("click", function () {
    var pickedLanguage = $(this).attr("data-name");
    console.log(pickedLanguage);
    if (pickedLanguage === "English") {
      language = "English";
      englishify();
      renderButtons(topics);
      engStartup();
    } else {
      language = "French";
      frenchify();
      renderButtons(sujets);
      frenStartup();
    }
    getArticles();
  });
}

function getArticles() {
  // console.log("getArticles is running");
  $(".search-button").on("click", function () {
    articleSearch = $(this).attr("data-name");
    console.log("this is the subject searched " + articleSearch);
    console.log("Looking for articles");
    if (language === "English") {
      queryURL =
        "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
        articleSearch +
        "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
      engArticleSearch(queryURL);
    } else {
      queryURL =
        "https://newsapi.org/v2/everything?q=" +
        articleSearch +
        "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
      frenArticleSearch(queryURL);
    }
  });
}

function engStartup() {
  var queryURL =
    "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    myText = $("<div class='card-columns'></div>"); // reset div with articles
    for (var j = 0; j < 10; j++) {
      var headline = response.results[j].title;
      var url = response.results[j].url;
      var author = response.results[j].byline;
      var content = response.results[j].abstract;
      renderHTML(url, headline, author, content);
    }
  });
}

function frenStartup() {
  var queryURL =
    "http://newsapi.org/v2/top-headlines?country=fr&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    myText = $("<div class='card-columns'></div>"); // reset div with articles
    for (var j = 0; j < 10; j++) {
      var headline = response.articles[j].title;
      var url = response.articles[j].url;
      var author = response.articles[j].author;
      var content = response.articles[j].content;
      renderHTML(url, headline, author, content);
    }
  });
}

function engArticleSearch(queryURL) {
  // var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + articleSearch + "&page=0&sort=newest&api-key=hh8LJpb49GiBE4VMM6TKst92CHnrv9cy";
  console.log(articleSearch);
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log("let's clear out the articles-space");
    myText = $("<div class='card-columns'></div>"); // reset div with articles
    for (var j = 0; j < 10; j++) {
      var headline = response.response.docs[j].headline.main;
      var url = response.response.docs[j].web_url;
      var author = response.response.docs[j].byline_original;
      var content = response.response.docs[j].lead_paragraph;
      renderHTML(url, headline, author, content);
    }
  });
}

function frenArticleSearch(queryURL) {
  // var queryURL = "https://newsapi.org/v2/everything?q=" + articleSearch + "&sources=liberation&sortBy=popularity&apiKey=b39076bb4e5d4f61a4974e9c2ab2e755";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    myText = $("<div class='card-columns'></div>"); // reset div with articles
    for (var j = 0; j < 10; j++) {
      var headline = response.articles[j].title;
      var url = response.articles[j].url;
      var author = response.articles[j].author;
      var content = response.articles[j].content;
      renderHTML(url, headline, author, content);
    }
  });
}

function renderHTML(url, headline, author, content) {
  var articlesDiv = $("<div class='card article'>");
  var title = $("<p class='card-title headline'>").html(
    "<a target='_blank' href='" + url + "'>" + headline + "</a>"
  );
  var byline = $("<p class='card-text'>").html(author);
  var blurb = $("<p class='card-text'>").html(content);
  articlesDiv.append(title);
  articlesDiv.append(byline);
  articlesDiv.append(blurb);
  articlesDiv.appendTo(myText);
  $("#articles-space").prepend(myText);
}
