/*
Listen for clicks in the popup.

If the click is on one of the beasts:
  Inject the "beastify.js" content script in the active tab.

  Then get the active tab and send "beastify.js" a message
  containing the URL to the chosen beast's image.

If it's on a button wich contains class "clear":
  Reload the page.
  Close the popup. This is needed, as the content script malfunctions after page reloads.
*/

// execute the script now so it can listen to the messages sent by the code below
browser.tabs.executeScript(null, { file: "/content_scripts/markpage.js" });


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    //var chosenBeast = e.target.textContent;
    //var chosenBeastURL = beastNameToURL(chosenBeast);

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      beginStart(tabs[0]);
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});

function beginStart(tab) {
  console.log("MarkPage beginstart");
  //var pageUrl = window.location.href;
  console.log(" - pageUrl = "+tab.url);
  var req = new XMLHttpRequest();
  if (req) {
    var url = "https://markpage-server.herokuapp.com/extract-content?format=content-only&from=" + btoa(tab.url);
    console.log(" - marpage-server request url: GET "+url);
    req.open('GET', url, true);
    req.onload = function() {
      console.log(req.responseText);
      browser.tabs.sendMessage(tab.id, {message: "start", restext: req.responseText});
    };
    req.onerror = function() {
      alert("Failed to get webpage content!");
    }
    console.log("Created XMLHttpRequest, sending...");
    req.send();
  } else {
    console.log("!!! couldn't create XMLHttpRequest");
  }
}