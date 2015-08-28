// Create the event listener for events from the tab and options
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

  // If the browser action requested for Justice to initialize
  if (message.type === "justice.newtab") {

    // When a new tab requests status, retrieve it from localStorage
    var state = localStorage.getItem("justice.run") !== "false";

    // Run Justice on load if it is enabled
    if (state) {
      sendCommandToContent("justice.start");
    }

    // Update the icon based on the state
    setIcon(state);
  }

  // If the browser action requested for Justice to run
  if (message.type === "justice.start") {
    sendCommandToContent(message.type);
    localStorage.setItem("justice.run", true);

    // Update the icon based on the state
    setIcon(true);
    //chrome.browserAction.setIcon({path: "../../img/fpsIcon-38.png"});
  }

  // If the browser action requested for Justice to stop
  if (message.type === "justice.stop") {
    sendCommandToContent(message.type);
    localStorage.setItem("justice.run", false);

    // Update the icon based on the state
    setIcon(false);

    // Remove fps meter
    updateFPSCopy("");
    //chrome.browserAction.setIcon({path: "../../img/fpsIcon-38-disabled.png"});
  }

  // If the content page sent an fps update
  if (message.type === "justice.fps") {
    // Set the badge to show the current FPS
    //console.log(message.data);
    updateFPSCopy(message.data);
  }

});

var sendCommandToContent = function(message, config) {
  //console.log(chrome.tabs, chrome.tabs.getSelected);

  chrome.tabs.getSelected(null, function(tab){
    //console.log(tab, tab.id);

    var metrics = {
      TTFB:             { budget: localStorage.getItem("justice.options.ttfb") },
      domInteractive:   { budget: localStorage.getItem("justice.options.interactive") },
      domComplete:      { budget: localStorage.getItem("justice.options.complete") },
      firstPaint:       { budget: localStorage.getItem("justice.options.paint") },
      pageLoad:         { budget: localStorage.getItem("justice.options.load") },
      requests:         { budget: localStorage.getItem("justice.options.requests") }
    };

    chrome.tabs.sendMessage(tab.id, {type: message, data: metrics});
  });
};

var generateInitialSettings = function() {
  setItemDefault("justice.options.ttfb", 200);
  setItemDefault("justice.options.interactive", 250);
  setItemDefault("justice.options.complete", 800);
  setItemDefault("justice.options.paint", 1000);
  setItemDefault("justice.options.load", 2000);
  setItemDefault("justice.options.requests", 8);
};

var setItemDefault = function(key, value) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, value);
  }
};

var setIcon = function(active) {
  //console.log(active);
  chrome.browserAction.setIcon({
    path: {
      19: '../../img/fpsIcon-19' + (active ? '' : '-disabled') + '.png',
      38: '../../img/fpsIcon-38' + (active ? '' : '-disabled') + '.png'
    }
  });
};


var updateFPSCopy = function(fps) {

  // Only allow disabling updates to the text when the state is false
  if (fps === "" || localStorage.getItem("justice.run") !== "false") {
    chrome.browserAction.setBadgeText({text: fps + ""});
  }
};

// On initialization show the appropriate icon based on state
var state = localStorage.getItem("justice.run") !== "false";

// Set the icon based on the state
setIcon(state);

// Update the badge color
chrome.browserAction.setBadgeBackgroundColor({ color: [51, 51, 51, 230] });

// Initialize settings that are not set with defaults
generateInitialSettings();