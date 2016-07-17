/* global FormManager, Rules, rulesTable, tableController, translateHTML */

'use strict';

var rulesContainer;
var deleteRule;

var addButton = document.querySelector('#add-button');

var formManager = new FormManager();

formManager.on('add', (rule) => rulesContainer.add(rule));
formManager.on('remove', () => rulesContainer.remove(deleteRule));
formManager.on('save', (rule) => rulesContainer.edit(deleteRule, rule));
formManager.on('hide', () => addButton.classList.remove('hidden'));

addButton.addEventListener('click', e => {
    e.preventDefault();

    formManager.show('add');

    addButton.classList.add('hidden');
});

rulesTable.addEventListener('click', e => {
    deleteRule = e.target.dataset.number || e.target.parentNode.dataset.number;

    formManager.fill(rulesContainer.storage.rules[deleteRule]);
    formManager.show('edit');

    addButton.classList.remove('hidden');
});

window.addEventListener('load', () => {
    translateHTML();

    chrome.storage.sync.get('rules', obj => {
        rulesContainer = new Rules(obj.rules || []);

        tableController.table();

        chrome.storage.onChanged.addListener(() => {
            tableController.table();
        });
    });
});
