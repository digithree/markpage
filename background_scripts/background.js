function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

/*
browser.tabs.onUpdated.addListener(cookieUpdate);
browser.tabs.executeScript(null, { file: "/content_scripts/markpage.js" });

function cookieUpdate(tabId, changeInfo, tab) {
  getActiveTab().then((tabs) => {
  	returnMessage("updateData", "got data", getDataForUrl(tabs[0].url));
  }); 
}
*/




/*
 *
 */
function backgroundMessage(request, sender, sendResponse) {
	//sendResponse({response: "error", message: "command not found"});
	console.log("backgroundMessage, got message: "+request.message);
	if (request.message.localeCompare("saveData") == 0) {
		var data = request.data;
		var exisitingData = getDataForUrl(data.url);
		if (request.createIfNew) {
			if (exisitingData != null) {
				sendResponse({response: "success", message: "nothing to save, createIfNew not activiated as data is existing", data: exisitingData});
				return;
			}
		} else if (exisitingData != null) {
			if (exisitingData.hashedContent != data.hashedContent) {
				// page content has changed, reset highlights
				data.highlights = [];
				// send message informing of reset
				updateData(data);
				sendResponse({response: "reset data", message: "highlights reset", data: existingData});
				// and do not continue
				return;
			}
		}
		// save updated / new data
		try {
			//sendResponse({response: "error", message: "could not save data"});
			updateData(data, function() {
				sendResponse({response: "success", message: "data saved", data: data});
			}, function(err) {
				sendResponse({response: "error", message: "could not save data, "+err.message});
			});
		} catch (err) {
			sendResponse({response: "error", message: "could not save data, "+err.message});
		}
	} else if (request.message.localeCompare("getData") == 0) {
		sendResponse({response: "success", message: "processing getData command", data: getDataForUrl(request.url)});
	} else {
		sendResponse({response: "error", message: "command not found"});
	}
}

/*
function returnMessage(message, extra, data) {
    getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {message: message, extra: extra, data: data});
    });
}
*/

/*
Assign markpage() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(backgroundMessage);