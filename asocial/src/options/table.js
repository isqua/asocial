'use strict';

var TimeHelper = require('./timehelper');
var EventEmitter = require('./eventemitter');
var utils = require('./utils');

function getDay(n) {
    return chrome.i18n.getMessage(`days_${n}`);
}

function TableController() {
    this.rulesTable = document.querySelector('.time-table');
    this.templateRow = document.querySelector('#row-template').content.querySelector('.rule-line');

    this.rulesTable.addEventListener('click', (e) => {
        var number = e.target.dataset.number || e.target.parentNode.dataset.number;

        this.trigger('click', number);
    });
}

/**
 * Return string of days of the week.
 * @param {RuleDays} days
 * @returns {String}
 */
TableController.prototype.getDays = function(days) {
    return (days.length % 7) ?
        days.map(getDay).join(', ') :
        chrome.i18n.getMessage('options_everyday');
};

/**
 * Make HTML element with social network icon.
 * @param {String} network
 * @returns {Element}
 */
TableController.prototype.getNetworkIcon = function(network) {
    var networkBlock = document.createElement('span');
    networkBlock.classList.add('icon', `icon-${network}`);
    return networkBlock;
};

/**
 * @param {RuleSites} sites
 * @returns {Text|DocumentFragment} - block with social network icons
 */
TableController.prototype.getSites = function(sites) {
    var sitesFilter = Object.keys(sites).filter(k => sites[k]).sort();

    return sitesFilter.length ?
        document.createTextNode(chrome.i18n.getMessage('options_all')) :
        utils.getFragment(sitesFilter.map(this.getNetworkIcon));
};

/**
 * Make HTML element with specific rule content.
 *
 * @param {Rule} rule
 * @param {Number} number - number of rule in rule's array.
 * @returns {Node} - table row with rule.
 */
TableController.prototype.row = function(rule, number) {
    var row = this.templateRow.cloneNode(true);

    row.querySelector('.days').textContent = this.getDays(rule.days);
    row.querySelector('.time').innerHTML = TimeHelper.formatPeriod(rule.start, rule.end);
    row.querySelector('.networks').appendChild(this.getSites(rule.sites));

    row.dataset.number = number;

    return row;
};

/**
 * Make table with existing rules.
 *
 * @param {Rule[]} rules
 */
TableController.prototype.table = function(rules) {
    this.rulesTable.innerHTML = '';
    this.rulesTable.appendChild(utils.getFragment(rules.map(this.row, this)));
};

utils.inherit(TableController, EventEmitter);

module.exports = new TableController();