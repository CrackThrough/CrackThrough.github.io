$(function () {
  // ready event

  hljs.configure({ useBR: true });

  document.querySelectorAll("div.code").forEach((block) => {
    hljs.highlightBlock(block);
  });

  $("#a").on("click", function () {});
});
