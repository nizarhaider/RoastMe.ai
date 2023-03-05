var headerFinished = false;
var head_text = "pip install roastbot...";
var a = 0;
var barCompleted = false;
var header = $("#comments-header h3");
var header_interval = setInterval(function () {
  $('.blinking-cursor').remove();
  header.append(head_text[a]);
  header.append("<span class='blinking-cursor'>' '</span>");
  a++;
  if (a >= head_text.length) {
    $('.blinking-cursor').remove();
    clearInterval(header_interval);
    startCommentPrinting();
  }
}, 100);

let typing = false;

function haltFunction() {
  clearInterval(promptInterval);
  clearInterval(header_interval);
  clearTimeout(timeout)
  $("#comments-list").text("");
  if (typing) {
    clearTimeout(typing_time);
    typing = false;
  }
  if (isPrinting) {
    clearInterval(promptInterval);
    isPrinting = false;
  }
}

var isPrinting = false;

function startCommentPrinting() {
  isPrinting = true;
  var commentsList = $("#comments-list");
  var prompts = ["...", "Too scared to upload that face?...", "Don't worry, I'll be nice. I promise...", "Your mom was faster than this...", "Tell her I said hi btw"];
  var currentPrompt = 0;
  var b = 0;
  function startPrinting() {
    if (b === 0) {
      commentsList.text("");
    }
    $('.blinking-cursor').remove();
    commentsList.append(prompts[currentPrompt][b]);
    commentsList.append("<span class='blinking-cursor'>| |</span>");
    b++;
    if (b >= prompts[currentPrompt].length) {
      clearInterval(promptInterval);
      currentPrompt++;
      b = 0;
      if (currentPrompt >= prompts.length) {
        currentPrompt = 0;
      }
      timeout = setTimeout(() => {
        promptInterval = setInterval(startPrinting, 100);
      }, 3000);
    }
  }
  promptInterval = setInterval(startPrinting, 25);
}


Dropzone.options.myDropzone = {
  url: '/',

  paramName: "image",
  method: 'post',
  maxFiles: 1,
  addRemoveLinks: true,
  dictDefaultMessage: "Click here to upload a selfie",
  acceptedFiles: "image/*",
  maxFilesize: 10,
  resizeWidth: null,
  resizeHeight: null,

  init: function () {
    var progressBar = document.querySelector('.progress-bar-wrapper');

    this.on("maxfilesexceeded", function (file) {
      this.removeFile(file);
      this.submit();
    });

    this.on("addedfile", function (file) {

      // Perform any additional processing on the file here
      if (this.files.length > 1) {
        this.removeFile(this.files[0]);
        this.options.dictRemoveFile = "Remove";
        this.options.dictCancelUpload = "Cancel";
      }
      haltFunction();
    });
    
    this.on("success", function (file, response) {
      const ajaxPromise = new Promise((resolve, reject) => {

        formData = new FormData();
        formData.append("image", file);
        $.ajax({
          url: "/", // the URL to handle the file upload
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success: function (data) {
            resolve(data);
          },
          error: function (error) {
            reject(error);
          }
        })
      });

      let data = {}; // default value

      ajaxPromise.then((response) => {
        data = response;
      });

      haltFunction();
      //clear elements inside progress bar
      progressBar.innerHTML = "";

      // Create the start and end elements
      var start = document.createElement("div");
      start.classList.add("progress-start");
      start.innerText = "|";

      var end = document.createElement("div");
      end.classList.add("progress-end");
      end.innerText = "|";

      // Append the start and end elements to the progress bar wrapper
      progressBar.appendChild(start);

      progressBar.style.display = "flex";
      var blockCount = 0;
      var intervalId = setInterval(function () {
        if (blockCount < 12 && data.fun_pass != "True" && data.fun_pass != "Cannot detect face" && data.fun_pass != "Similarity not found" ) {
          var block = document.createElement("div");
          block.classList.add("progress-block");
          progressBar.appendChild(block);
          blockCount++;
        }

        else {
          progressBar.appendChild(end);
          clearInterval(intervalId);


          if (data.fun_pass == "True") {
            document.getElementById("comments-list").scrollIntoView();
            var comments = data.comments;
            comments = JSON.parse(comments);
            comments = comments.map(comment => comment.replace("[", "").replace("]", "").replace("\u2019", "'"));
            $("#comments-list").append("<br>");

            function typeComment(i, j) {
              typing = true;
              if (i < 5 && i < comments.length) {
                if (j < comments[i].length) {
                  $('.blinking-cursor').remove();
                  $("#comments-list").append(comments[i][j]);
                  $("#comments-list").append("<span class='blinking-cursor'>' '</span>");
                  var delay = Math.floor(Math.random() * 75) + 25;
                  document.querySelector('.blinking-cursor').style.animationDelay = delay + 'ms';
                  setTimeout(function () {
                    typeComment(i, j + 1);
                  }, delay);
                } else {
                  $("#comments-list").append("<br>").append("<br>");
                  typing_time = setTimeout(function () {
                    typeComment(i + 1, 0);
                  }, 500);
                }
              }
              typing = false;
            }

            document.getElementById("comments-list").scrollIntoView();
            typeComment(0, 0);

            $('frame').removeClass('hidden');
            $("#user-img").attr("src", data.user_img);

          }
          else if (data.fun_pass == "Cannot detect face") {
            $("#comments-list").text("");
            $("#toast-body").text("");
            document.getElementById("comments-list").scrollIntoView();
            comments = "Failed to detect face. Please try a different image";
            $("#comments-list").append("<br>");
            $("#comments").append(comments);
            $("#toast-body").append(comments);

            $('.toast').toast('show');
            setTimeout(function () {
              $('.toast').toast('hide');
            }, 5000);
          }
          else if (data.fun_pass == "Similarity not found") {
            $("#comments-list").text("");
            $("#toast-body").text("");
            document.getElementById("comments-list").scrollIntoView();
            comments = "Failed to find a match. Please try a different image";
            $("#comments-list").append("<br>");
            $("#comments").append(comments);
            $("#toast-body").append(comments);

            $('.toast').toast('show');
            setTimeout(function () {
              $('.toast').toast('hide');
            }, 5000);
          }
          else {

            $("#comments-list").text("");
            $("#toast-body").text("");

            document.getElementById("comments-list").scrollIntoView();
            comments = "That face giving me problems. Please try a different image"
            $("#comments-list").append("<br>");
            $("#comments-list").append(comments);
            $("#toast-body").append(comments);

            $('.toast').toast('show');
            setTimeout(function () {
              $('.toast').toast('hide');
            }, 5000);

          }


        }

      }, 1000);


    });

  }
}