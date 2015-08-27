//console.log("Enable option handlers");

window.onload = function() {

  var isInitialized = localStorage.getItem("justice.run") !== "false";

  // Set the default option state
  document.getElementById("justice-state").innerHTML = isInitialized ? "Disable" : "Enable";

  // Create a listener for the start / stop button
  document.getElementById("justice-run").onclick = function() {
    var state = localStorage.getItem("justice.run") !== "false";

    document.getElementById("justice-state").innerHTML = state ? "Enable" : "Disable";

    chrome.extension.sendMessage({
      type: state ? "justice.stop" :  "justice.start"
    });
  }
};