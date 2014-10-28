var github_comment_box = $(".write-content");
if (github_comment_box) {
    $(".write-content").append($("<div id='rnl-uploader-drop' class='rnl-uploader-drop'>Drop any file here <div class='rnl-uploader-message'></div></div>"));

    var bucket = new AWS.S3({params: {Bucket: 'rnl-enhancement-suite'}});
    var uploader_message = $(".rnl-uploader-message");

    function drop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        console.log(evt);

        var file = evt.originalEvent.dataTransfer.files[0];

        uploader_message.text("Processing");

        var nameSplit = file.name.lastIndexOf(".");
        var file_name = file.name;
        if (nameSplit != -1) {
            file_name = file.name.substr(0, nameSplit) + "-"+ Date.now() + file.name.substr(nameSplit);
        }

        var params = {Key: file_name, ContentType: file.type, Body: file, ACL: "public-read"};
        bucket.putObject(params, function (err, data) {
            var textarea = github_comment_box.find("textarea");
            if (err) {
                uploader_message.text("ERROR!");
            } else {
                textarea.val(textarea.val() + "\n [" + file.name + "](https://s3.amazonaws.com/rnl-enhancement-suite/" + encodeURIComponent(file_name) + ")");
                uploader_message.text("Uploaded!");

                setTimeout(function() {
                    uploader_message.text("");
                }, 2000);
            }
        });
    }

    var dropbox = $("#rnl-uploader-drop");
    // init event handlers
    if (dropbox) {
        dropbox.on("dragenter dragexit dragover", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        });
        dropbox.on("drop", drop);
    }
}
