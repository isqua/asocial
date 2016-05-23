'use strict';

function makeAsocialBlock() {
    /**
     * @constant {HTMLElement} ASOCIAL_BLOCK - substitute for news block.
     */
    var ASOCIAL_BLOCK = document.createElement('div');

    ASOCIAL_BLOCK.classList.add('asocial_block');
    ASOCIAL_BLOCK.textContent = 'Здесь нет того, что ищешь ты. Работать иди, друг мой.';

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

window.addEventListener('load', function() {
    var asocialContentObserver = new MutationObserver(replaceNewsBlock);

    replaceNewsBlock();

    asocialContentObserver.observe(document.body, { attributes: true });
});
