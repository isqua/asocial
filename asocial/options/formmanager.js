/* global TimeHelper inherit EventEmitter */
/* exported FormManager */
'use strict';

function FormManager() {
    this.form = document.querySelector('#add-rule-form');
    this.days = this.form.elements.day;
    this.networks = this.form.elements.network;
    this.startTime = this.form.elements.start_time;
    this.endTime = this.form.elements.end_time;
    this.errorRow = document.querySelector('.error-row');

    this.container = document.querySelector('#add-rule-container');

    this.editButtonRow = document.querySelector('.edit-buttons-row');
    this.saveButton = this.form.elements.save_button;
    this.editButton = this.form.elements.edit_button;
    this.deleteButton = this.form.elements.delete_button;

    this.fill = (rule) => {
        this.startTime.value = TimeHelper.formatTime(rule.start);
        this.endTime.value = TimeHelper.formatTime(rule.end);

        Array.prototype.forEach.call(this.days, (elem) => {
            elem.checked = rule.days.indexOf(elem.value) !== -1;
        });

        Array.prototype.forEach.call(this.networks, (elem) => {
            elem.checked = Boolean(rule.sites[elem.value]);
        });
    };

    this.make = () => {
        var rule = {};

        rule.start = TimeHelper.parse(this.startTime.value);
        rule.end = TimeHelper.parse(this.endTime.value);
        rule.sites = {};

        rule.days = Array.prototype.filter.call(this.days, elem => elem.checked)
            .map(elem => elem.value);

        Array.prototype.forEach.call(this.networks, (elem) => {
            rule.sites[elem.value] = elem.checked;
        });

        return rule;
    };

    this.validateCheckbox = (checkboxes) => {
        return Array.prototype.some.call(checkboxes, elem => elem.checked);
    };

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

    this.changeForm = () => {
        var inputs = this.form.getElementsByTagName('input');

        Array.prototype.forEach.call(inputs, (elem) => {
            elem.addEventListener('change', () => {
                this.saveButton.disabled = this.editButton.disabled = !this.check();
            });
        });
    };

    this.check = () => {
        var isTimeValid = this.validateTime();
        var isValid = this.startTime.checkValidity() || this.endTime.checkValidity() || this.validateCheckbox(this.days) || this.validateCheckbox(this.networks);
        var isFormValid = isValid && isTimeValid;

        this.saveButton.disabled = this.editButton.disabled = ! isFormValid;

        return isFormValid;
    };

    this.show = (type) => {
        this.container.classList.add('showed');
        this.editButtonRow.classList.toggle('hidden', type === 'add');
        this.saveButton.classList.toggle('hidden', type !== 'add');
        this.endTime.classList.toggle('onerror', !this.validateTime());
        this.startTime.addEventListener('blur', this.validateTime);
        this.endTime.addEventListener('blur', this.validateTime);
        this.changeForm();
    };

    this.hide = () => {
        this.container.classList.remove('showed');
        this.editButtonRow.classList.add('hidden');
        this.startTime.removeEventListener('blur', this.validateTime);
        this.endTime.removeEventListener('blur', this.validateTime);
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

    this.deleteButton.addEventListener('click', (e) => {
        e.preventDefault();

        this.trigger('remove');
        this.hide();
    });
}

inherit(EventEmitter, FormManager);
