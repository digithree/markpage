# MarkPage

v0.3

<img src="/icons/markpage.png" alt="MarkPage logo" style="width: 200px; height: 200px"/>

Create persistent webpage text highlights on a webpage in the simplest possible way. Designed for webapges which are articles, such as Wikipedia, newspapers, blogs, etc.

## Why MarkPage?

The app concept is to allow for webpages to be highlighted in a simple way that does not rely on storage of webpage data so as to not infringe on copyright, and also to side step the technical obstacles of that approach.

This feature is already part of some systems, but my approach is to respect copyright by not _directly_ copying any content locally, and to respect privacy by not storing any personally identifying information about users in the (planned) remote sync feature.

I believe current solutions encourage infringement on copyright, and offer too many services I do not wish to use. To use a metaphor, I'd prefer to use a simple bicycle to get to the local shop, instead of an SUV.

## Feature roadmap

1. (basic) Text highlighting
2. (basic) Save highlights locally
3. (no progress) Save highlights remotely

### Text highlighting

1. Highlight text robustly, in the main body of text content for a webpage, in multiple colors.
2. Highlights should be editable only via a delete operation, to keep the interface as simple as possible.

**Planned**

1. Allow colour selection to be changed, or even customised to any color
2. Allow comments to be added to highlights, or tags or other mark-up

### Save highlights locally

Use content extraction on webpage to support several key features:

1. Save highlighted text as character offsets within the content extracted text body. In this way we can store data about the content which is not the content, and is not reversible into the content.
2. Create a hash of the extracted content. This will allow us to detect versioning and invalidate the highlights if a change has been made to the document. As a side note, this will also alert MarkPage users if a change has been made.

Content extraction relies on access to a [markpage-server](https://github.com/digithree/markpage-server), which itself is dependent on the [node-unfluff](https://github.com/ageitgey/node-unfluff) content extraction library for Node.js. I have a markpage-server running on Heroku at [https://markpage-server.herokuapp.com/](https://markpage-server.herokuapp.com/) for the purposes of this library. I encourage you to checkout the GitHub page for the server project also.

**Planned**

1. Migrate highlights if the webpage content changes. Otherwise, if a page is editted, even slightly (think of Wikipedia!) it will break highlights. Highlights are stored with the extracted content hash as a key to facilitate this, but it's not yet implemented.

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

#### Making a highlight

Any text you select will be automatically highlighted, if it passes the two conditions:

1. The total selected character count is 10 or more
2. There are at least 2 spaces between words.

These restrictions are intended to restrict usage to select sentences or sentence fragments.

The highlight color will cycle through 5 different colours automatically, for testing purposes, and is not editable or controllable.

#### Editing a highlight

Currently, you can only delete a highlight. Click on any highlight and you will be prompted to confirm you wish to delete it.

## Issue

There are some known issues which are being tracked in the GitHub issue tracker.

Please feel free to test out the plugin and log bugs. At this early stage there should be plenty, but don't let that stop you!

## Acknowledgements

Highlighting is provided by Mark.js, which is included as part of the main content script file [markpage.js](/content_scripts/markpage.js), i.e. the JavaScript file injected into the webpage. Mark.js is under the MIT license, same as this project.

Loading spinner gif used is Ajax-loader.gif, obtained from [https://commons.wikimedia.org/wiki/File:Ajax-loader.gif](https://commons.wikimedia.org/wiki/File:Ajax-loader.gif) and licensed as public domain.

## Changelog

*16.12.31 - v0.3.0*
- Highlights can be deleted by clicking them and confirming the action in a pop-up alert

*16.12.31 - v0.2.0*
- Save highlights to local storage (as reference to text position in extracted content only) and load from saved data

*16.12.31 - v0.1.2*
- Implement local storage of webpage data, including url and extracted content hash, as well as highlight array which is not yet used

*16.12.27 - v0.1.1*

- Integrate webpage content extraction service from [markpage-server](https://github.com/digithree/markpage-server) running at [https://markpage-server.herokuapp.com/](https://markpage-server.herokuapp.com/), working and responds with extracted content text. However is not integrated into plugin in any functional way yet
- Add loading spinner on pop up after clicking start, while waiting for content extraction service to respond

*16.12.26 - v0.1*

- Create project