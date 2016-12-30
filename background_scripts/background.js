function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

/* Retrieve any previously set cookie and send to content script */

browser.tabs.onUpdated.addListener(cookieUpdate);
browser.tabs.executeScript(null, { file: "/content_scripts/markpage.js" });

function cookieUpdate(tabId, changeInfo, tab) {
  getActiveTab().then((tabs) => {
    // get any previously set cookie for the current tab 
    var gettingCookies = browser.cookies.get({
      url: tabs[0].url,
      name: "markpage"
    });
    gettingCookies.then((cookie) => {
      if(cookie) {
        var cookieVal = JSON.parse(cookie.value);
      	browser.tabs.sendMessage(tabs[0].id, {message: "updateCookie", cookie: cookieVal});
      }
    });
  }); 
}


/*
 *
 */
function backgroundMessage(request, sender, sendResponse) {
	//sendResponse({response: "error", message: "command not found"});
	console.log("backgroundMessage, got message: "+request.message);
	if (request.message.localeCompare("saveCookie") == 0) {
		sendResponse({response: "success", message: "processing saveCookie command"});
		var cookie = {};
		if (request.cookie) {
			cookie = request.cookie;
			if (cookie.hashedContent != request.hashedContent) {
				// page content has changed, reset everything
				cookie.hashedContent = request.hashedContent;
				cookie.highlights = [];
				// send message informing of reset
				returnMessage("resetCookie");
				// and do not continue
				return;
			} else {
				// otherwise, update highlights only
				cookie.highlights = request.highlights;
			}
		} else {
			cookie = {
				url: request.url,
				hashedContent: request.hashedContent,
				highlights: request.highlights
			};
		}
		// save updated / new cookie
		try {
			var setCookie = browser.cookies.set({
				url: request.url,
				name: "markpage", 
				value: JSON.stringify(cookie)
			});
			setCookie.then(function(res) {
				returnMessage("savedCookie", JSON.stringify(cookie));
			}, function(err) {
				returnMessage("saveCookieError", err.message);
			});
		} catch (err) {
			console.log("error setting cookie: "+err.message);
			returnMessage("saveCookieError");
		}
	} else {
		sendResponse({response: "error", message: "command not found"});
	}
}

function returnMessage(message, extra, cookie) {
    getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {message: message, extra: extra, cookie: cookie});
    });
}

/*
Assign markpage() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(backgroundMessage);


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