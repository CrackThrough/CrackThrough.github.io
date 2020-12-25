$(function () {
  // ready event
  $("#filedrop").on("click", function () {
    // click event
    loadFile();
  });

  $("filedrop").on("drop", (event) => {
    loadFile();
    event.preventDefault();
  });
  $("filedrop").on("dragover", (event) => {
    loadFile();
    event.preventDefault();
  });
});

function dragOverHandler(ev) {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log("... file[" + i + "].name = " + file.name);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log(
        "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
      );
    }
  }
}

function copyToClipboard(elem) {
  // create hidden text element, if it doesn't already exist
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    // can just use the original source element for the selection and copy
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
    // must use a temporary form element for the selection and copy
    target = document.getElementById(targetId);
    if (!target) {
      var target = document.createElement("textarea");
      target.style.position = "absolute";
      target.style.left = "-9999px";
      target.style.top = "0";
      target.id = targetId;
      document.body.appendChild(target);
    }
    target.textContent = elem.textContent;
  }
  // select the content
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection
  var succeed;
  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === "function") {
    currentFocus.focus();
  }

  if (isInput) {
    // restore prior selection
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    // clear temporary content
    target.textContent = "";
  }
  return succeed;
}

// const ADOFAI = window.ADOFAI;

function loadFile() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt, .json, .adofai";
  input.onchange = function (event) {
    processFile(event.target.files[0]);
  };
  input.click();
}

var loadedMap = null;
function processFile(file) {
  var reader = new FileReader();
  reader.onload = function () {
    loadedMap = reader.result.toString();

    var resultWriter = document.getElementById("txt");
    resultWriter.textContent = "calculating..";

    var levelstr = loadedMap;

    var level = ADOFAI.Import(levelstr);

    level.settings.song += ` <size=50><color="#4f4f4f">[Invisible]</color></size>`;
    var moveTracks = level.actions.filter((x) => x.eventType == "MoveTrack");
    for (var i = 0; i < moveTracks.length; i++) {
      moveTracks[i].eventValue.opacity = 0;
    }
    if (
      level.actions
        .filter((x) => x.floor == 0)
        .filter((x) => x.eventType == "MoveTrack").length == 0
    ) {
      console.log("Added invis");
      level.actions.push(
        new ADOFAI.Action(
          0,
          "MoveTrack",
          new ADOFAI.Action.ACTIONS_LIST["MoveTrack"](
            [0, ADOFAI.Enums.TILE_RANGE_TYPES.FIRST],
            [0, ADOFAI.Enums.TILE_RANGE_TYPES.LAST],
            0,
            [0, 0],
            0,
            100,
            0,
            0,
            ADOFAI.Enums.EASES.LINEAR,
            ""
          )
        )
      );
    }

    for (var i = 0; i < level.actions.length; i++) {
      if (level.actions[i].eventType == "AnimateTrack") {
        level.actions[i] = null;
      }
    }

    level.actions = level.actions.filter((x) => x != null);

    level.settings.beatsAhead = level.settings.beatsBehind = 0;
    level.settings.trackAnimation = level.settings.trackDisappearAnimation =
      "None";

    resultWriter.textContent = level.Export();

    copyToClipboard(resultWriter);
  };

  reader.readAsText(file, /* optional */ "euc-kr");
}
