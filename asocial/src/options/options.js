'use strict';

var FormManager = require('./formmanager');
var Rules = require('./rules');
var TableController = require('./table');
var translate = require('./translate');

var rulesContainer;
var deleteRule;

var addButton = document.querySelector('#add-button');

FormManager.on('add', (rule) => rulesContainer.add(rule));
FormManager.on('remove', () => rulesContainer.remove(deleteRule));
FormManager.on('save', (rule) => rulesContainer.edit(deleteRule, rule));
FormManager.on('hide', () => addButton.classList.remove('hidden'));

addButton.addEventListener('click', e => {
    e.preventDefault();

    FormManager.show('add');

    addButton.classList.add('hidden');
});

TableController.on('click', (number) => {
    deleteRule = number;
    FormManager.fill(rulesContainer.storage.rules[number]);
    FormManager.show('edit');

    addButton.classList.remove('hidden');
});

window.addEventListener('load', () => {
    translate.translateHTML();

    chrome.storage.sync.get('rules', obj => {
        rulesContainer = new Rules(obj.rules || []);

        TableController.table(rulesContainer.storage.rules);

        chrome.storage.onChanged.addListener(() => {
            TableController.table(rulesContainer.storage.rules);
        });
    });
});
