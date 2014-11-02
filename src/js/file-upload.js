$(function() {
      var github_comment_box = $(".github .write-content");
      if (github_comment_box) {
          github_comment_box.append($("<div id='rnl-uploader-drop' class='rnl-uploader-drop'>Drop files here <div class='rnl-uploader-message'></div></div>"));

          var bucket = new AWS.S3({params: {Bucket: 'rnl-enhancement-suite'}});
          var uploader_message = $(".rnl-uploader-message");

          function drop(evt) {
              evt.stopPropagation();
              evt.preventDefault();

              var files = evt.originalEvent.dataTransfer.files;
              var uploaded_count = 0;

              uploader_message.text("Processing (" + files.length + ")");
              $.each(files, function(index, file) {
                  var nameSplit = file.name.lastIndexOf(".");
                  var file_name = file.name;
                  if (nameSplit != -1) {
                      file_name = file.name.substr(0, nameSplit) + "-"+ Date.now() + file.name.substr(nameSplit);
                  }

                  var params = {Key: file_name, ContentType: file.type, Body: file, ACL: "public-read"};
                  bucket.putObject(params, function (err, data) {
                      var textarea = github_comment_box.find("textarea");
                      if (err) {
                          console.log(err);
                          uploader_message.text("ERROR!");
                      } else {
                          textarea.val(textarea.val() + "\n [" + file.name + "](https://s3.amazonaws.com/" + bucket.config.params.Bucket + "/" + encodeURIComponent(file_name) + ")");

                          if (++uploaded_count === files.length) {
                              uploader_message.text("Uploaded!");

                              setTimeout(function() {
                                  uploader_message.text("");
                              }, 2000);
                          }
                      }
                  });
              });
          }

          var dropbox = $("#rnl-uploader-drop");
          if (dropbox) {
              dropbox.on("dragenter dragexit dragover", function(evt) {
                  evt.stopPropagation();
                  evt.preventDefault();
              });
              dropbox.on("drop", drop);
          }
      }

});
