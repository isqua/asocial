/* global chrome */
/* exported shouldDisable */
'use strict';

/**
 * checkRule - checking rule
 *
 * @param  {String} network
 * @param  {Date} time
 * @param  {Object} rule
 * @return {Boolean}
 */
function checkRule(network, time, rule) {
    if (!rule.sites[network]) {
        return false;
    }

    if (rule.days.length !== 0 && rule.days.indexOf(time.getDay()) === -1) {
        return false;
    }

    var startTime = new Date();
    var endTime = new Date();
    var isAfterStart = true;
    var isBeforeEnd = true;

    if (rule.start) {
        startTime.setHours(...rule.start, 0, 0);
        isAfterStart = startTime <= time;
    }

    if (rule.end) {
        endTime.setHours(...rule.end, 0, 0);
        isBeforeEnd = time < endTime;
    }

    return isAfterStart && isBeforeEnd;
}

/**
 * shouldDisable - network activity checking
 *
 * @param  {String} network
 * @param  {Function} callback
 */
function shouldDisable(network, callback) {
    chrome.storage.sync.get('rules', rulesContainer => {
        var currentTime = new Date();

        var result = rulesContainer.rules.some(rule => checkRule(network, currentTime, rule));

        callback(result);
    });
}
