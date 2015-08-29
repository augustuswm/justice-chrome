// Keep track of the Justice initialization
var justiceIsInitialized = false;

// When a new tab starts up, inform the background task so it can
// decide if Justice should be initialized
chrome.extension.sendMessage({type: "justice.newtab"});

// Listen for control commands from the extension for Justice for Justice
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

  //console.log(message);

  // If the background script requested for Justice to start
  if (message.type === "justice.start") {

    //console.log("justice.start");
    //if (justiceIsInitialized) {
    //  Justice.start();
    //} else {
      initalizeJustice(message.data);
      //justiceIsInitialized = true;
    //}
  }

  // If the background script requested for Justice to stop
  if (message.type === "justice.stop") {
    //console.log("justice.stop");
    Justice.stop();
  }

});

var initalizeJustice = function(metrics) {
  Justice.init({
    metrics: metrics,
    warnThreshold: 0.8,
    showFPS: true,
    chartType: "spline",
    fpsCallback: function(fps) {
      chrome.extension.sendMessage({type: "justice.fps", data: fps});
      //chrome.browserAction.setBadgeText({text: fps});
      //console.log(fps);
    }
  });
};