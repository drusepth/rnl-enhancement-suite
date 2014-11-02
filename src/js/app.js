$(function() {
    var App = {};

    var host = window.location.host;
    $("body").addClass(host.substring(0, host.indexOf(".com")));

    App.toggle_images = function() {
        $(".comment-body img:not('.toggled'):not('.emoji')").hide().addClass("toggled")
            .before($("<a href='#' style='display:block;'>Toggle image</a>").click(function() {
                    $(this).next().toggle();
                    return false;
                })
            );
    };

    // Github actions
    App.toggle_images();

    // Huboard actions
    $(document).on('DOMNodeInserted', function(e) {
        if ($(e.target).find(".comment-body").length > 0) {
            App.toggle_images();
        }

        // Highlight tickets with [?] in the title
        if ($(e.target).find(".card").length) {
            $(".column:not(:first) .title:contains('[?]')").closest(".card").css({ borderWidth: "2px", borderColor: "red" });
            $(".column:not(:first) .title").filter(function() {
                return !$(this).text().match(/\[.*\]/);
                }).closest(".card").css({ borderWidth: "2px", borderColor: "red" });
        }
    });
});
