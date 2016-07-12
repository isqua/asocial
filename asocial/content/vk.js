/* global chrome */
'use strict';

function makeAsocialBlock() {
    /**
     * @constant {HTMLElement} ASOCIAL_BLOCK - substitute for news block.
     */
    var ASOCIAL_BLOCK = document.createElement('div');

    ASOCIAL_BLOCK.classList.add('asocial_block');
    ASOCIAL_BLOCK.textContent = chrome.i18n.getMessage('motivateMessage');

    return ASOCIAL_BLOCK;
}

function replaceNewsBlock() {
    /**
     * @constant {HTMLElement} NEWS_BLOCK - substituted news block.
     */
    var NEWS_BLOCK = document.querySelector('#main_feed');
    var RIGHT_COLUMN = document.querySelector('.narrow_column_wrap');

    if (NEWS_BLOCK) {
        var newsParent = NEWS_BLOCK.parentNode;

        newsParent.insertBefore(makeAsocialBlock(), NEWS_BLOCK);
        newsParent.removeChild(NEWS_BLOCK);

        if (RIGHT_COLUMN) {
            RIGHT_COLUMN.parentNode.removeChild(RIGHT_COLUMN);
        }
    }

    document.body.classList.add('asocial_showed');
}

/**
 * check - send response for check rules
 */
function check() {
    var CHECKING_TIMEOUT = 5000;

    chrome.runtime.sendMessage('vk');
    setTimeout(check, CHECKING_TIMEOUT);
}

/**
 * enableAsocial - replace block and enable observer
 *
 * @param  {type} callback - function for replace news block.
 */
function enableAsocial(callback) {
    var asocialContentObserver = new MutationObserver(callback);

    callback();

    asocialContentObserver.observe(document.body, { attributes: true });
}

window.addEventListener('load', function() {
    var isDisabled = false;

    chrome.runtime.onMessage.addListener(function(shouldDisable) {
        if (shouldDisable) {
            enableAsocial(replaceNewsBlock);
            isDisabled = true;
        } else {
            if (isDisabled) {
                location.reload();
            }
        }
    });

    document.body.classList.add('asocial_showed');

    check();
});
