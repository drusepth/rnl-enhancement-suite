var App = {
    initialize: function() {
        this.host = window.location.host;

        this.set_body_class();
        this.toggle_images();
        this.link_out();
    },
    set_body_class: function() {
        $("body").addClass(this.host.substring(0, this.host.indexOf(".com")));
    },
    toggle_images: function() {
        $(".comment-body img:not('.toggled'):not('.emoji')").hide().addClass("toggled")
            .before($("<a href='#' style='display:block;'>Toggle image</a>").click(function() {
                    $(this).next().toggle();
                    return false;
                })
            );
    },
    link_out: function(force_all) {
        force_all = default_for(force_all, false);
        $(".comment-body a").filter(function() {
                if (force_all) {
                    return true;
                }

                return $(this).not('.issue-link');
            }).attr("target", "_blank");
    }
};

$(function() {
    App.initialize();
});

function default_for(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}
