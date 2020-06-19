$(document).ready(function () {
  //#region Functions
  $.fn.selectRange = function (start, end) {
    if (end === undefined) {
      end = start;
    }
    return this.each(function () {
      if ("selectionStart" in this) {
        this.selectionStart = start;
        this.selectionEnd = end;
      } else if (this.setSelectionRange) {
        this.setSelectionRange(start, end);
      } else if (this.createTextRange) {
        var range = this.createTextRange();
        range.collapse(true);
        range.moveEnd("character", end);
        range.moveStart("character", start);
        range.select();
      }
    });
  };
  $.fn.getCursorPosition = function () {
    var input = this.get(0);
    if (!input) return; // No (input) element found
    if ("selectionStart" in input) {
      // Standard-compliant browsers
      return input.selectionStart;
    } else if (document.selection) {
      // IE
      input.focus();
      var sel = document.selection.createRange();
      var selLen = document.selection.createRange().text.length;
      sel.moveStart("character", -input.value.length);
      return sel.text.length - selLen;
    }
  };
  //#endregion

  $("#bStyle").text(myBPref + myBrush);

  for (var i = 0; i < 250; i++) {
    $(`<span id="slot${i}" onclick="setSlot(${i})">`)
      .addClass("gridBlock")
      .appendTo(".gridWrapper");
  }

  $("input:text[id='mapname']").on(
    "propertychange change keyup paste input",
    () => {
      var c = $("input:text[id='mapname']")
        .val()
        .replace(/[^0-9a-z]/gi, "")
        .substr(0, 128);
      $("input:text[id='mapname']").val(c);
    }
  );

  /**
 *   $("#txt").on("input", () => {
    var cs = $("#txt").getCursorPosition();
    var thisLine = Math.floor(cs / 10);
    var linecs = cs % 10;

    var str = $("#txt").val();
    var strList = str.split("\n");
    if (strList[thisLine]) strList[thisLine] = strList[thisLine].substr(0, 10);
    var _str = "";
    strList.forEach((e) => {
      _str += `${e}\n`;
    });
    $("#txt").val(_str);
  });
 */
  $("#txt").on("propertychange change paste input", () => {
    /**
     *     var replaceAs = $("#txt")
      .val()
      .replace(/[^roygbkp#.]/gi, "");
    var repArr = [];
    for (var i = 0; i < replaceAs.length / 10; i++) {
      repArr.push(replaceAs.substr(i * 10, 10));
    }
    var cs = $("#txt").getCursorPosition();

    replaceAs = "";
    var c = 0;
    repArr.forEach((e) => {
      if (e.length < 10 && e.length > 0) e = e + ".".repeat(10 - e.length);
      if (e.length > 10) e = e.substr(0, 10);
      e = e.toUpperCase();
      if (c <= 24) {
        replaceAs += `${e}\n`;
        c++;
      }
    });
    $("#txt").val(replaceAs);
    if (replaceAs[cs - 1] == "\n") cs++;
    $("#txt").selectRange(cs);
     */
    // update(1);
  });
});

var gridValues = [];
for (var i = 0; i < 250; i++) {
  gridValues.push({ id: i, color: "N" });
}

const getObjectIndex = (arr, num) => {
  return arr
    .map((f) => {
      return f.id;
    })
    .indexOf(num);
};

const getObject = (arr, id) => {
  return arr.find((f) => f.id == id);
};

const colorToLink = (c) => {
  var result = "";
  switch (c) {
    case "R":
      result = "./TMPGenerator_src/block3.png";
      break;
    case "O":
      result = "./TMPGenerator_src/block4.png";
      break;
    case "Y":
      result = "./TMPGenerator_src/block5.png";
      break;
    case "G":
      result = "./TMPGenerator_src/block6.png";
      break;
    case "B":
      result = "./TMPGenerator_src/block7.png";
      break;
    case "K":
      result = "./TMPGenerator_src/block8.png";
      break;
    case "P":
      result = "./TMPGenerator_src/block9.png";
      break;
    case "A":
      result = "./TMPGenerator_src/block2.png";
      break;
    case "N":
      result = "";
      break;
  }
  return result;
};

const resetBg = () => {
  for (var i = 0; i < 250; i++) {
    $("#slot" + i).css("background-color", "black");
  }
};

const colorBg = (s, c = 0) => {
  if (s < 0 || s > 249) return;
  var color = "";
  switch (c) {
    case 0:
      color = "rgb(0, 89, 0)";
      break;
    case 1:
      color = "rgb(89, 0, 0)";
      break;
  }
  $("#slot" + s).css("background-color", color);
};

const slotXYConv = (convertTo, value) => {
  var r = null;
  switch (convertTo) {
    case "number":
      var x = value[0];
      var y = value[1];

      r = x - 1 + (y - 1) * 10;

      break;
    case "position":
      var x = (value + 1) % 10,
        y = Math.floor((value + 1) / 10) + 1;

      if (x == 0) {
        x = 10;
        y -= 1;
      }

      r = [x, y];

      break;
  }

  return r;
};

const setSlot = (slotId) => {
  if (slotId < 0 || slotId > 249) return;

  switch (brushIntConv(0, myBrush)) {
    case 0:
      getObject(gridValues, slotId).color = _gpc();
      $("#slot" + slotId).css(
        "background-image",
        `url(${colorToLink(_gpc())})`
      );
      break;
    case 1:
      if (brushPickedSlot == null) {
        colorBg(slotId);
        brushPickedSlot = slotId;
      } else {
        colorBg(slotId, 1);

        var p1 = slotXYConv("position", brushPickedSlot);
        var p2 = slotXYConv("position", slotId);

        var affectSize = drawSquare(p1, p2);

        affectSize.forEach((a) => {
          var num = slotXYConv("number", a);
          getObject(gridValues, num).color = _gpc();
          $("#slot" + num).css(
            "background-image",
            `url(${colorToLink(_gpc())})`
          );
        });

        resetBg();
        brushPickedSlot = null;
      }
      break;
  }

  // setting value
  update(0);
};

function getDiff(n1, n2) {
  return Math.abs(n1 - n2);
}

function getLeast(n1, n2) {
  return Math.min(n1, n2);
}

function drawSquare(p1, p2) {
  var result = [];

  var _r = getDiff(p1[0], p2[0]) + 1;
  var _c = getDiff(p1[1], p2[1]) + 1;

  for (var y = 0; y < _c; y++) {
    for (var x = 0; x < _r; x++) {
      result.push([x + getLeast(p1[0], p2[0]), y + getLeast(p1[1], p2[1])]);
    }
  }

  return result;
}

const getPaintColor = (slotId = null) => {
  var result = "";
  if (slotId == null) {
    result = "";
  } else {
    var index = getObjectIndex(gridValues, slotId);
    if (index == -1) {
      result = "";
    } else {
      result = gridValues[index].color;
    }
  }
  return result;
};

function _gpc() {
  var result = "";
  var arr = [
    $("input:radio[name='blocks']:radio[id='blockR']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockO']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockY']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockG']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockB']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockK']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockP']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockA']").prop("checked"),
    $("input:radio[name='blocks']:radio[id='blockN']").prop("checked"),
  ];

  switch (arr.indexOf(true)) {
    case 0:
      result = "R";
      break;
    case 1:
      result = "O";
      break;
    case 2:
      result = "Y";
      break;
    case 3:
      result = "G";
      break;
    case 4:
      result = "B";
      break;
    case 5:
      result = "K";
      break;
    case 6:
      result = "P";
      break;
    case 7:
      result = "A";
      break;
    case 8:
      result = "N";
      break;
    case -1:
      result = "N";
      break;
  }
  return result;
}

/**
const getClosestMultiples = (t, e) => {
  if ("number" != typeof t || "number" != typeof e) return NaN;
  var a,
    s = !0,
    h = [],
    r = 0;
  if (t >= 0) {
    for (; s; ) h.push(r * e), t <= r * e && (s = !1), r++;
    var n = h[h.length - 1],
      l = h[h.length - 2];
    a = Math.abs(t - n) > Math.abs(t - l) ? l : n;
  } else {
    for (; s; ) h.push(r * e), t >= r * e && (s = !1), r--;
    (n = h[h.length - 1]), (l = h[h.length - 2]);
    a = Math.abs(t - n) > Math.abs(t - l) ? l : n;
  }
  return a;
};

 */

const r = (n) => {
  switch (n) {
    case 0:
      for (var i = 0; i < gridValues.length; i++) {
        gridValues[i] = { id: i, color: "N" };
        $(`#slot${i}`).css("background-image", "url('')");
      }
      update(0);
      break;
    case 1:
      for (var i = 0; i < gridValues.length; i++) {
        var color = _gpc();
        gridValues[i] = { id: i, color: color };
        $(`#slot${i}`).css("background-image", `url('${colorToLink(color)}')`);
      }
      update(0);
      break;
  }
};

const stringify = (arr) => {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var color = arr[i].color;
    if (color == "N") color = ".";
    if (color == "A") color = "#";
    result += color;
    if ((i + 1) / 10 == Math.floor((i + 1) / 10)) {
      result += "\n";
    }
  }
  result = result.replace(/undefined/g, ".");
  var _arr = result.split("\n");
  var _flag = false;
  for (var i = 0; i < _arr.length; i++) {
    if (!_flag) {
      if (_arr[i].replace(/[.]/g, "") == "") _arr[i] = "";
    }
    if (_arr[i].replace(/[.]/g, "") != "") _flag = true;
  }
  result = "";
  _arr.forEach((e) => {
    if (e != "") {
      result += `${e}\n`;
    }
  });
  return result;
};

function update(mode) {
  switch (mode) {
    case 0:
      // when updating txt file
      $("#txt").val(stringify(gridValues));
      break;
    case 1:
      // when updating entire gui
      var str = $("#txt")
        .val()
        .replace(/[\n]/g, "")
        .replace(/[#]/g, "A")
        .replace(/[.]/g, "N");
      var lineCount = $("#txt").val().replace(/[^\n]/g, "").length - 1;
      /**      for (var i = 0; i < 250; i++) {
        console.log(str[i]);
        gridValues[i].color = str[i];
        setSlot(i, str[i], false);
      } */

      // this function WONT be available
      break;
  }
}

var myBrush = "one block";
var myBPref = "Current brush style: ";
var brushPickedSlot = null;

function toggleToolstyle() {
  switch (myBrush) {
    case "one block":
      myBrush = "square";
      break;
    case "square":
      myBrush = "one block";
      break;
  }
  return $("#bStyle").text(myBPref + myBrush);
}

const brushIntConv = (mode, input) => {
  var result = null;
  switch (mode) {
    case 0:
      switch (input) {
        case "one block":
          result = 0;
          break;
        case "square":
          result = 1;
          break;
      }
      break;
    case 1:
      switch (input) {
        case 0:
          result = "one block";
          break;
        case 1:
          result = "square";
          break;
      }
      break;
  }
  return result;
};
