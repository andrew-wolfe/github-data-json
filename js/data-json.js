$(document).ready(function() {
  // clipboard - ZeroClipboard
  var clip = new ZeroClipboard($("#copy-it"), {
    moviePath: "js/ZeroClipboard.swf"
  });

  clip.on('load', function (client) {
    //debugstr("Flash movie loaded and ready.");
  });

  clip.on('noFlash', function (client) {
    $(".demo-area").hide();
    //debugstr("Your browser has no Flash.");
  });

  clip.on('wrongFlash', function (client, args) {
    $(".demo-area").hide();
   // debugstr("Flash 10.0.0+ is required but you are running Flash " + args.flashVersion.replace(/,/g, "."));
  });

  clip.on('complete', function (client, args) {
    //debugstr("Copied text to clipboard: " + args.text);
  });

  // github data.json files
  $("#submit").click(function(event) {
    // change as needed
    var gh_user = $("#user").val(); // change for another user/group
    var gh_results = "#json"; // change to class of the div to append results
    
    // don't change
    var gh_api = "https://api.github.com"; // base url for github api

    // ajax call to GET the list of repos
    $.ajax({
      async: false,
      dataType: 'json',
      type: "GET",
      url: gh_api + "/users/" + gh_user + "/repos", // api for repos
      success:function(repos) {
        //for (i in repos) {
        for (var i=0; i<2; i++) { // ***** USE TO TEST, LIMITS API CALLS
          // create url for api call for the readme, used in next ajax call

          // output the repo name
          //$(gh_results).val(gh_results.val+"<h1 class=\"gh-repo-name\">" + repos[i].name + "</h1>");

          // ajax call to GET the raw markdown file for that repo
          $.ajax({
            async: false,
            headers: { 
              Accept : "application/vnd.github.raw"
            },
            type: "GET",
            url: gh_api + "/repos/" + gh_user + "/" + repos[i].name + "/contents/data.json", // api for data.json
            success:function(readme) {
              $(gh_results).val(gh_results.val+readme);
              // ajax POST call to convert md to html
              /*$.ajax({
                async: false,
                contentType: "text/plain",
                data: readme, // the raw readme file
                type: "POST",
                url: gh_api + "/markdown/raw", // api for markdown to html
                success:function(readme_markdown) {
                  // output the html of the readme
                  $(gh_results).val(gh_results.val+"<div class=\"gh-repo-readme\">" + readme_markdown + "</div>");                 
                },
                error: function(jqXHR, textStatus, error){
                  console.log(jqXHR, textStatus, error);
                }
              });*/
            },
            error: function(jqXHR, textStatus, error){
              console.log(jqXHR, textStatus, error);
            }
          });
        }
      },
      error: function(jqXHR, textStatus, error){
        console.log(jqXHR, textStatus, error);
      }
    });
    // show the results
    //$("#json").val(gh_user);
    $("#json-container").removeClass("hidden");
  });
});