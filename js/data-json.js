$(document).ready(function() {
  // clipboard - ZeroClipboard
  var clip = new ZeroClipboard($("#copy-it"), {
    moviePath: "js/ZeroClipboard.swf"
  });

  clip.on('load', function (client) {
    // Flash movie loaded and ready
  });

  clip.on('noFlash', function (client) {
    $("#messages").text($("#messages").data("warningNoFlash"));
    $("#messages").removeClass("hidden");
  });

  clip.on('wrongFlash', function (client, args) {
    $("#messages").text($("#messages").data("warningWrongFlash"));
    $("#messages").removeClass("hidden");
  });

  clip.on('complete', function (client, args) {
    $("#messages").text($("#messages").data("success"));
    $("#messages").removeClass("hidden");
  });

  // github data.json files
  $("#submit").click(function(event) {
    if ($.trim($("#user").val()) == '') {
      // show error, hide and clear text area
      $("#user-message").text($("#user-message").data("warningNoUser"));
      $("#user-message").removeClass("hidden");
      $("#json-container").addClass("hidden");
      $("#json").val('');
    } else {
      var gh_user = $("#user").val();
      var gh_results = "#json";               // div to append results
      
      var gh_api = "https://api.github.com";  // base url for github api

      // clear the text area
      $(gh_results).val('');
      $("#user-message").addClass("hidden");
      $("#messages").addClass("hidden");

      // GET the list of repos
      $.ajax({
        async: false,
        dataType: 'json',
        type: "GET",
        url: gh_api + "/users/" + gh_user + "/repos", // api for repos
        success:function(repos) {
          //for (i in repos) {
          for (var i=0; i<2; i++) { // ***** USE TO TEST, LIMITS API CALLS

            // output the repo name
            //$(gh_results).val(gh_results.val+"<h1 class=\"gh-repo-name\">" + repos[i].name + "</h1>");

            // GET the raw data.json file for each repo
            $.ajax({
              async: false,
              headers: { 
                Accept : "application/vnd.github.raw"
              },
              type: "GET",
              url: gh_api + "/repos/" + gh_user + "/" + repos[i].name + "/contents/data.json", // api for data.json
              success:function(datajson) {
                if ($.trim($(gh_results).val()) != '') {
                  $(gh_results).val(gh_results.val+datajson);
                } else {
                  $(gh_results).val(datajson);
                }
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
      $("#json-container").removeClass("hidden");
      if ($.trim($(gh_results).val()) == '') {
        $("#messages").text($("#messages").data("warningNoData"));
        $("#messages").removeClass("hidden");
        $(gh_results).val($("#messages").data("warningNoData"));
      } else {
        $("#messages").addClass("hidden");
      }
    } // end else (github user entered)
  });
});