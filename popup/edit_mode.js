/*
 * Listen for clicks in the popup.
 * 
 * Original code based on beastify.js WebExtension example, in tutorial
 */

var loadingImage = null;

// execute the script now so it can listen to the messages sent by the code below
browser.tabs.executeScript(null, { file: "/content_scripts/markpage.js" });

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      beginStart(e.target, tabs[0]);
    });
  }
  else if (e.target.classList.contains("clear")) {
    browser.tabs.reload();
    window.close();
  }
});

function beginStart(clickedElement, tab) {
  addLoadingImage(clickedElement);
  console.log("MarkPage beginstart");
  console.log(" - pageUrl = "+tab.url);
  var req = new XMLHttpRequest();
  if (req) {
    var url = "https://markpage-server.herokuapp.com/extract-content?format=content-only&from=" + btoa(tab.url);
    console.log(" - marpage-server request url: GET "+url);
    req.open('GET', url, true);
    req.onload = function() {
      removeLoadingImage(clickedElement);
      console.log(req.responseText);
      browser.tabs.sendMessage(tab.id, {message: "start", url: tab.url, restext: req.responseText});
    };
    req.onerror = function() {
      removeLoadingImage(clickedElement);
      alert("Failed to get webpage content!");
    }
    console.log("Created XMLHttpRequest, sending...");
    req.send();
  } else {
    console.log("!!! couldn't create XMLHttpRequest");
  }
}

function addLoadingImage(element) {
  removeLoadingImage(element);
  element.innerHTML = "";
  loadingImage = document.createElement("img");
  loadingImage.src = "/icons/ajax-loader.gif";
  element.appendChild(loadingImage);
}

function removeLoadingImage(element) {
  if (loadingImage != null) {
    element.removeChild(loadingImage);
    element.innerHTML = "Start";
  }
}

function getCookies(url) {
  console.log("loadCookieData for url: "+url);
  // get any previously set cookie for this webpage
  var cookies = [];
  var gettingCookies = browser.cookies.get({
        url: url,
        name: "markpage"
      });
  gettingCookies.then((cookie) => {
      if (cookie) {
        cookieData = JSON.parse(cookie.value);
        console.log(" - got cookie");
        cookies.push(cookieData);
      } else {
        console.log(" - got bad cookie");
      }
    });
  return cookies;
}