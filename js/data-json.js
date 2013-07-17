$(document).ready(function() {
  // clipboard - ZeroClipboard
  var clip = new ZeroClipboard($("#copy-it"), {
    moviePath: "js/ZeroClipboard.swf"
  });

  clip.on('load', function (client) {
    // Flash movie loaded and ready
  });

  clip.on('noFlash', function (client) {
    $("#copy-message").text($("#copy-message").data("warningNoFlash")).removeClass("hidden");
  });

  clip.on('wrongFlash', function (client, args) {
    $("#copy-message").text($("#copy-message").data("warningWrongFlash")).removeClass("hidden");
  });

  clip.on('complete', function (client, args) {
    $("#copy-message").text($("#copy-message").data("success")).removeClass("hidden");
  });

  // github data.json files
  $("#submit").click(function(event) {
    // always hide and clear the textarea and messages
    $("#json-container").addClass("hidden");
    $("#json").val('');
    $("#github-message").addClass("hidden").text('');
    $("#copy-message").text('').addClass("hidden");

    if ($.trim($("#user").val()) == '') {
      // show error, hide and clear text area
      $("#github-message").text($("#github-message").data("warningNoUser")).removeClass("hidden");
    } else {
      var gh_user = $("#user").val();
      var gh_results = "#json";               // div to append results
      
      var gh_api = "https://api.github.com";  // base url for github api

      var jsonstring = '';
      var found = new Array();
      var notfound = new Array();

      // clear the text area
      $(gh_results).val('');
      $("#github-message").addClass("hidden");

      // GET the list of repos
      $.ajax({
        async: false,
        dataType: 'json',
        type: "GET",
        url: gh_api + "/users/" + gh_user + "/repos", // api for repos
        success:function(repos) {
          if (typeof repos !== 'undefined' && repos.length > 0) {
            for (i in repos) {
           // for (var i=0; i<2; i++) { // ***** USE TO TEST, LIMITS API CALLS
              // GET the raw data.json file for each repo
              $.ajax({
                async: false,
                headers: { 
                  Accept : "application/vnd.github.raw"
                },
                type: "GET",
                url: gh_api + "/repos/" + gh_user + "/" + repos[i].name + "/contents/data.json", // api for data.json
                success:function(datajson) {
                  // remove brackets from result, []
                  datajson = $.trim(datajson);
                  jsonstring = jsonstring + $.trim(datajson.substring(1).substring(0, datajson.length - 2)) + ",";
                  found.push(repos[i].name);
                },
                error: function(jqXHR, textStatus, error){
                  console.log(jqXHR, textStatus, error);
                  // we may have had success
                  if ($.trim($(gh_results).val()) == '') {
                    $("#github-message").text($("#github-message").data("warningNoData")).removeClass("hidden");
                  }
                  notfound.push(repos[i].name);
                }
              });
            } // end for
          } else { // no repos
            $("#github-message").text($("#github-message").data("warningNoRepos")).removeClass("hidden");
          } // end if repos
        },
        error: function(jqXHR, textStatus, error){
          $("#github-message").text($("#github-message").data("warningNoGhUser")).removeClass("hidden");
          console.log(jqXHR, textStatus, error);
        }
      });
      // show the results
      if (jsonstring.length > 0) {
        $("#json-container").removeClass("hidden");
        $("#github-message").text('').addClass("hidden");
        $(gh_results).val("[" + $.trim(jsonstring.substring(0, jsonstring.length - 1)) + "]");
      }
      $("#found").text(found.toString().replace(",", ", "));
      $("#notfound").text(notfound.toString().replace(",", ", "));
    } // end else (github user entered)
  });
});