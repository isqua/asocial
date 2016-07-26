'use strict';

function Rules(array) {
    this.storage = {'rules': array};

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
}

Rules.prototype.add = function(object) {
    this.storage.rules.push(object);
    chrome.storage.sync.set(this.storage);
};

Rules.prototype.remove = function(number) {
    this.storage.rules.splice(number, 1);
    chrome.storage.sync.set(this.storage);
};

Rules.prototype.edit = function(number, object) {
    this.storage.rules[number] = object;
    chrome.storage.sync.set(this.storage);
};

module.exports = Rules;
