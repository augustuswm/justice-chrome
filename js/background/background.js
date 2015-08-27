var isInitialized = false;

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
  }

  // If the browser action requested for Justice to stop
  if (message.type === "justice.stop") {
    sendCommandToContent(message.type);
    localStorage.setItem("justice.run", false);
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



