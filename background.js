//opens a new tab upon clicking the extension icon
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({url: chrome.extension.getURL('popup.html')});
});
