/* global chrome */
/* exported translateHTML */
'use strict';

/**
 * translateHTML - translate HTML content with chrome.i18n
 */
function translateHTML() {
    var array = document.querySelectorAll('[data-i18n]');

    Array.prototype.forEach.call(array, elem => {
        elem.textContent = chrome.i18n.getMessage(elem.dataset.i18n);
    });
}
