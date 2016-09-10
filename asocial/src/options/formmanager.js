'use strict';

/**
 * Rule for blocking algorithm
 * @typedef {Object} Rule
 *
 * @property {RuleTime|Null} start - time to start blocking.
 * @property {RuleTime|Null} end - time to end blocking.
 * @property {RuleSites} sites
 * @property {RuleDays} days
 */

/**
 * Array with to numbers: hours and minutes.
 * @typedef {Array.<Number>} RuleTime
 * @property {Number} 0 - hours
 * @property {Number} 1 - minutes
 */

/**
 * Object with checked social networks (keys) and boolean values.
 * @typedef {Object} RuleSites
 * @property {Boolean} vk
 * @property {Boolean} facebook
 * @property {Boolean} twitter
 */

/**
 * Array with number of days (0 - Sunday, 6 - Saturday).
 * @typedef {Number[]} RuleDays
 */

var utils = require('./utils');
var EventEmitter = require('./eventemitter');
var TimeHelper = require('./timehelper');

function FormManager() {
    this.form = document.querySelector('#add-rule-form');
    this.days = this.form.elements.day;
    this.networks = this.form.elements.network;
    this.startTime = this.form.elements.start_time;
    this.endTime = this.form.elements.end_time;

    this.container = document.querySelector('#add-rule-container');

    this.editButtonRow = document.querySelector('.edit-buttons-row');
    this.saveButton = this.form.elements.save_button;
    this.editButton = this.form.elements.edit_button;

    this.inputs = Array.prototype.slice.call(this.form.getElementsByTagName('input'), 0);

    /**
     * Fill form with rule.
     * @param {Rule} rule
     */
    this.fill = (rule) => {
        this.startTime.value = TimeHelper.formatTime(rule.start);
        this.endTime.value = TimeHelper.formatTime(rule.end);

        Array.prototype.forEach.call(this.days, (elem) => {
            elem.checked = rule.days.indexOf(parseInt(elem.value, 10)) !== -1;
        });

        Array.prototype.forEach.call(this.networks, (elem) => {
            elem.checked = Boolean(rule.sites[elem.value]);
        });
    };

    /**
     * Parse form and make rule for blocking.
     * @returns {Rule}
     */
    this.make = () => {
        var rule = {};

        rule.start = TimeHelper.parse(this.startTime.value);
        rule.end = TimeHelper.parse(this.endTime.value);
        rule.sites = {};

        rule.days = Array.prototype.filter.call(this.days, elem => elem.checked)
            .map(elem => parseInt(elem.value, 10));

        Array.prototype.forEach.call(this.networks, (elem) => {
            rule.sites[elem.value] = elem.checked;
        });

        return rule;
    };

    /**
     * Check at least one input is filled.
     * @param {NodeList} checkboxes
     * @returns {Boolean}
     */
    this.validateCheckbox = (checkboxes) => {
        return Array.prototype.some.call(checkboxes, elem => elem.checked);
    };

    /**
     * @returns {Boolean}
     */
    this.validateTime = () => {
        var startArray = TimeHelper.parse(this.startTime.value);
        var endArray = TimeHelper.parse(this.endTime.value);

        if (startArray && endArray) {
            var result;
            var startTime = new Date();
            var endTime = new Date();

            startTime.setHours(startArray[0], startArray[1], 0);
            endTime.setHours(endArray[0], endArray[1], 0);

            result = startTime <= endTime;

            this.endTime.classList.toggle('onerror', !result);

            return result;
        }
        return true;
    };

    /**
     * Check validity of time and at least one input filled.
     * @returns {Boolean} - true - valid, false - invalid.
     */
    this.check = () => {
        var isTimeValid = this.validateTime();
        var isValid = this.startTime.checkValidity() || this.endTime.checkValidity() ||
            this.validateCheckbox(this.days) || this.validateCheckbox(this.networks);
        var isFormValid = isValid && isTimeValid;

        this.saveButton.disabled = this.editButton.disabled = ! isFormValid;

        return isFormValid;
    };

    /**
     * Enable or disable form buttons based on form validity
     */
    this.toggleButtons = () => {
        this.saveButton.disabled = this.editButton.disabled = !this.check();
    };

    /**
     * Show add/change form in the page.
     * @param {String} type
     */
    this.show = (type) => {
        this.container.classList.add('showed');
        this.editButtonRow.classList.toggle('hidden', type === 'add');
        this.saveButton.classList.toggle('hidden', type !== 'add');
        this.endTime.classList.toggle('onerror', !this.validateTime());
        this.startTime.addEventListener('blur', this.validateTime);
        this.endTime.addEventListener('blur', this.validateTime);

        this.inputs.forEach((input) => {
            input.addEventListener('change', this.toggleButtons);
        });
    };

    this.hide = () => {
        this.container.classList.remove('showed');
        this.editButtonRow.classList.add('hidden');
        this.startTime.removeEventListener('blur', this.validateTime);
        this.endTime.removeEventListener('blur', this.validateTime);

        this.inputs.forEach((input) => {
            input.removeEventListener('change', this.toggleButtons);
        });

        this.trigger('hide');
    };

    this.saveButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (this.check()) {
            this.trigger('add', this.make());
        }
    });

    this.editButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (this.check()) {
            this.trigger('save', this.make());
            this.hide();
        }
    });
}

utils.inherit(FormManager, EventEmitter);

module.exports = new FormManager();
