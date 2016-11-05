'use strict';

var utils = require('../utils');

chrome.runtime.onMessage.addListener(function(message, sender) {
    shouldDisable(message, function(res) {
        chrome.tabs.sendMessage(
            sender.tab.id,
            res
        );
    });
});

/**
 * shouldDisable - network activity checking
 *
 * @param  {String} network
 * @param  {Function} callback
 */
function shouldDisable(network, callback) {
    chrome.storage.sync.get('rules', rulesContainer => {
        var currentTime = new Date();

        var result = rulesContainer.rules.some(rule => utils.checkRule(currentTime, rule, network));

        callback(result);
    });
}
