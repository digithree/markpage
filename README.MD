# MarkPage

v0.1.1

<img src="/icons/markpage.png" alt="MarkPage logo" style="width: 200px; height: 200px"/>

Highlight text on a webpage. Main planned feature is to save for later, both locally and in anonymous store.

## Why MarkPage?

The concept is to allow for webpages to be highlighted in a simple way that does not rely on storage of webpage data so as to not infringe on copyright, and also to side step the technical obstacles of that approach.

## Feature roadmap

1. (in progress) Text highlighting
2. (in progress) Save highlights locally
3. (no progress) Save highlights remotely

In detail

### Text highlighting

1. Highlight text robustly, in the main body of text content for a webpage, in multiple colors.
2. Highlights should be editable only via a delete operation, to keep the interface as simple as possible.

Perhaps we should allow comments to be added to highlights, or tags or other mark-up.

### Save highlights locally

Use content extraction on webpage to support several key features:

1. Save highlighted text as character offsets within the content extracted text body. In this way we can store data about the content which is not the content, and is not reversible into the content.
2. Create a hash of the extracted content. This will allow us to detect versioning and invalidate the highlights if a change has been made to the document. As a side note, this will also alert MarkPage users if a change has been made.

Content extraction is not implemented yet, and in the selection of the library it must be very deterministic and stable over time, i.e. it should output the exact same characters if there has been no change in the body of the document.

Also note that it would be great to use some kind of ```git diff``` style difference detection to migrate highlights if the document does change.

### Save highlights remotely

The user can choose to post their highlights to a remote server to share with other users of the plugin. These posts will not contain any identifying information and there will be no account based authentication procedure.

Instead the server will give the user a unique private key for their post which only the user (i.e. local plugin data) will know. Using this they can post updates to their remote highlight (i.e. sync with their local changes).

We may allow a couple of hashtags to be attached to a post in order to facilitate viewing better, but the usage of any personally identifying information is strongly discouraged.

## Usage

_Note: this project is still a work in progress and not at first release yet_

### Install

To install an unpublished browser plugin in Firefox, follow the instructions as per the Mozilla WebExtensions guide, from [here](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension#Installing):

> Open "about:debugging" in Firefox, click "Load Temporary Add-on" and select any file in your add-on's directory [...] The add-on will now be installed, and will stay until you restart Firefox. Alternatively, you can run the WebExtension from the command line using the [web-ext](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext) tool.

### Starting

Once installed you will see the [MarkPage logo](/icons/markpage-48.png) in your plugins bar. Click on this to open the pop-up, and in this click "Start" to inject the script into the current webpage.

### Using

Any text you select will be automatically highlighted, if it passes the two conditions:

1. The total selected character count is 10 or more
2. There are at least 2 spaces between words.

These restrictions are intended to restrict usage to select sentences or sentence fragments.

The highlight color will cycle through 5 different colours automatically, for testing purposes, and is not editable or controllable.

## Known issues

### Text selection

Mark.js uses a regex based system for highlighting or if there is an identical sentence existing to an intentionally highlighted one, it will also be highlighted. This is what the sentence restrictions are in place to combat.

If there are overlapping you should expect undefined behaviour. This should probably be checked against and not allowed to occur.

## Acknowledgements

Highlighting is provided by Mark.js, which is included as part of the main content script file [markpage.js](/content_scripts/markpage.js), i.e. the JavaScript file injected into the webpage. Marj.js is under thew MIT license, same as this project.

Loading spinner gif used is Ajax-loader.gif, obtained from [https://commons.wikimedia.org/wiki/File:Ajax-loader.gif](https://commons.wikimedia.org/wiki/File:Ajax-loader.gif) and licensed as public domain.

## Changelog

*16.12.27 - v0.1.1*

- Integrate webpage content extraction service from [markpage-server](https://github.com/digithree/markpage-server) running at [https://markpage-server.herokuapp.com/](https://markpage-server.herokuapp.com/), working and responds with extracted content text. However is not integrated into plugin in any functional way yet
- Add loading spinner on pop up after clicking start, while waiting for content extraction service to respond

*16.12.26 - v0.1*

- Create project