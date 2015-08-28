//console.log("Enable option handlers");

window.onload = function() {

  var isInitialized = localStorage.getItem("justice.run") !== "false";

  // Set the default option state
  updateStateDisplay(isInitialized);

  // Create a listener for the start / stop button
  document.getElementById("justice-toggle").onclick = function() {
    var state = localStorage.getItem("justice.run") !== "false";

    updateStateDisplay(state);

    chrome.extension.sendMessage({
      type: state ? "justice.stop" :  "justice.start"
    });
  };

  // Populate the options fields with the values from storage and bind listeners
  var optionFields = document.getElementsByClassName("option");

  for (var i = 0; i < optionFields.length; i++) {
    var optionKey = optionFields[i].dataset.option;

    // Set the display value to the currently stored value
    optionFields[i].value = localStorage.getItem("justice.options." + optionKey);

    optionFields[i].onkeyup = function(event) {
      var target = event.target,
          key = target.dataset.option;

      console.log(key, target.value);

      // Store the value that was entered to the appropriate key
      localStorage.setItem("justice.options." + key, target.value);
    };
  }
};

var updateStateDisplay = function(state) {
  var stateDisplays = document.getElementsByClassName("justice-state");

  for (var i = 0; i < stateDisplays.length; i++) {
    stateDisplays[i].innerHTML = state ? "Show Monitor" : "Pause Monitor";
  }
};