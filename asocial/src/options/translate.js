'use strict';

module.exports = {
    /**
     * translateHTML - translate HTML content with chrome.i18n
     */
    translateHTML: function translateHTML() {
        var array = document.querySelectorAll('[data-i18n]');

        Array.prototype.forEach.call(array, elem => {
            elem.textContent = chrome.i18n.getMessage(elem.dataset.i18n);
        });
    }
};
