$(function () {
  // ready event
  for (var i = 0; i < Math.round(Math.random() * 7 + 30); i++) {
    var square = $("<li></li>");
    var size = Math.round(Math.random() * 107) + 13 + "px";

    square.css("left", `${Math.round(Math.random() * 100)}%`);
    square.css("width", size);
    square.css("height", size);
    square.css("animation-delay", `${Math.round(Math.random() * 20)}s`);
    square.css("animation-duration", `${Math.round(Math.random() * 7) + 18}s`);
    square.appendTo(".bgsquareanim");
  }
});
