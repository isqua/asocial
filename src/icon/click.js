'use strict';

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        active: true,
        url: 'options/options.html'
    }, null);
});
