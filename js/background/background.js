var isInitialized = false;

// On initialization show the appropriate icon based on state
var state = localStorage.getItem("justice.run") !== "false";

// Set the icon based on the state
chrome.browserAction.setIcon({path: "../../img/fpsIcon-38" + (state ? "" : "-disabled") + ".png"});

// Create the event listener for events from the tab and options
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

  // If the browser action requested for Justice to initialize
  if (message.type === "justice.newtab") {
    // Run Justice on load if it is enabled
    if (localStorage.getItem("justice.run") !== "false") {
      sendCommandToContent("justice.start");
    }
  }

  // If the browser action requested for Justice to run
  if (message.type === "justice.start") {
    sendCommandToContent(message.type);
    localStorage.setItem("justice.run", true);
    // Set the icon based on the state
    chrome.browserAction.setIcon({path: "../../img/fpsIcon-38.png"});
  }

  // If the browser action requested for Justice to stop
  if (message.type === "justice.stop") {
    sendCommandToContent(message.type);
    localStorage.setItem("justice.run", false);
    // Set the icon based on the state
    chrome.browserAction.setIcon({path: "../../img/fpsIcon-38-disabled.png"});
  }

  // If the content page sent an fps update
  if (message.type === "justice.fps") {
    // Set the badge to show the current FPS (casted to string)
    chrome.browserAction.setBadgeText({text: message.data + ""});
  }

});

var sendCommandToContent = function(message) {
  //console.log(chrome.tabs, chrome.tabs.getSelected);

  chrome.tabs.getSelected(null, function(tab){
    console.log(tab, tab.id);
    chrome.tabs.sendMessage(tab.id, {type: message});
  });
};



