$(document).ready(function() {
  
  var lastClicked;
  var toCalc, storeEval, addToCalc;
  var multiply = /×/gi, divide = /÷/gi;
  
  $(".arrows").hide();
  
  $("#clear").click(function() {
    $("#big, #small").empty();
    toCalc = null, storeEval = undefined, addToCalc = null;
  });
  
  $(".button").click(function() {
    
    if ($(this).hasClass("number")) {
      appendNumsToBottom.call($(this));
      lastClicked = "number";
      
    } else if ($(this).hasClass("operation")) {
      appendNumsToTopAndExecuteCalcs.call($(this));
      lastClicked = "operation";
      
    } else if ($(this).hasClass("decimal")) {
      appendDecimal();
      lastClicked = "decimal";
      
    } else if ($(this).hasClass("equals")) {
      executeFinalCalcIfNecessary();
      $("#small").empty();
      showFinalOutput();
      toCalc = null, storeEval = undefined, addToCalc = null;
      lastClicked = "equals";
    }
    
    if ($("#small").text().length > 28) {
      $(".arrows").show("slow");
      var interval;
      var content = $("#small");
      var scroll = content.get(0).scrollWidth - content.get(0).clientWidth;
      content.scrollLeft(scroll);
      $(function() {
        $("#left").mousedown(function() {
          interval = setInterval(function() {
            content.scrollLeft(content.scrollLeft() - 2);
          }, 50);
        });
        $("#right").mousedown(function() {
          interval = setInterval(function() {
            content.scrollLeft(content.scrollLeft() + 2);
          }, 50);
        });
        $("#left, #right").on("mouseup mouseleave", function() {
          clearInterval(interval);
        });
      });
    } else {
      $(".arrows").hide("slow");
    }
    
  });
  
  
  
  function replaceOpChars(str) {
    str = str.replace(multiply, "*");
    str = str.replace(divide, "/");
    return str;
  }
  
  function appendNumsToBottom() {
    if (lastClicked == "operation" || !($("#big").text()) || lastClicked == "equals") {
      $("#big").css("font-size", "38px");
      $("#big").text($(this).text());
    } else if ($("#big").text() && lastClicked != "operation") {
      if ($("#big")[0].offsetWidth - 5 < $("#big")[0].scrollWidth && $("#big").text().length >= 10) {
        $("#big").css("font-size", 400 / ($("#big").text().length + 1) + "px");
        $("#big").append($(this).text());
      } else {
        $("#big").append($(this).text());
      }
    }
  }
  
  function appendNumsToTopAndExecuteCalcs() {
    if (lastClicked == "decimal") {
      $("#small").append(" " + $("#big").text() + "0 " + $(this).text());
      $("#big").append("0");
    } else if ($("#big").text() && !($("#small")).text() && lastClicked != "operation") {
      $("#small").text($("#big").text() + " " + $(this).text());
    } else if ($("#big").text() && lastClicked != "operation") {
      $("#small").append(" " + $("#big").text() + " " + $(this).text());
      calculateLatestToDisplay();
    } else if (lastClicked == "operation") {
      var string = $("#small").text();
      var strLength = string.length;
      var replace = $(this).text();
      $("#small").text(string.substring(0, strLength - 1) + replace);
    }
  }
  
  function calculateLatestToDisplay() {
    if (typeof storeEval == "undefined") {
      toCalc = $("#small").text().substring(0, $("#small").text().length - 1);
      toCalc = replaceOpChars(toCalc);
      storeEval = +eval(toCalc).toFixed(5);
      if (storeEval.toString().length >= 10) {
        $("#big").css("font-size", 400 / (storeEval.toString().length + 1) + "px");
        $("#big").text(storeEval);
      } else {
        $("#big").text(storeEval);
      }
    } else {
      addToCalc = $("#small").text().substring(toCalc.length, $("#small").text().length - 1);
      addToCalc = replaceOpChars(addToCalc);
      storeEval = +eval(storeEval + addToCalc).toFixed(5);
      toCalc = $("#small").text().substring(0, $("#small").text().length - 1);
      toCalc = replaceOpChars(toCalc);
      if (storeEval.toString().length >= 10) {
        $("#big").css("font-size", 400 / (storeEval.toString().length + 1) + "px");
        $("#big").text(storeEval);
      } else {
        $("#big").text(storeEval);
      }
    }
  }
  
  function appendDecimal() {
    if (!$("#big").text() || lastClicked == "operation") {
      $("#big").text("0.");
    } else if ($("#big").text() && !$("#big").text().includes(".")) {
      $("#big").append(".");
    }
  }
  
  function executeFinalCalcIfNecessary() {
    if (typeof storeEval == "undefined") {
      toCalc = $("#small").text() + $("#big").text();
      toCalc = replaceOpChars(toCalc);
      storeEval = +eval(toCalc).toFixed(5);
    } else if (lastClicked != "operation") {
      addToCalc = $("#big").text();
      toCalc = $("#small").text().substring($("#small").text().length - 1);
      toCalc = replaceOpChars(toCalc);
      storeEval = +eval(storeEval + toCalc + addToCalc).toFixed(5);
    }
  }
  
  function showFinalOutput() {
    if (storeEval.toString().length >= 10) {
      $("#big").css("font-size", 400 / (storeEval.toString().length + 1) + "px");
      $("#big").text(storeEval);
    } else {
      $("#big").text(storeEval);
    }
  }

});