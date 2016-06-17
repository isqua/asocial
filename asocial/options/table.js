/* global TimeHelper, rulesContainer */
/* exported tableController */
var rulesTable = document.querySelector('.time-table');

var DAY_ABBR = {
    0: 'Вс',
    1: 'Пн',
    2: 'Вт',
    3: 'Ср',
    4: 'Чт',
    5: 'Пт',
    6: 'Сб'
};

var tableController = {
    row: function(rule, number) {
        var template = document.querySelector('#row-template');
        var templateRow = template.content.querySelector('.rule-line');
        var row = templateRow.cloneNode(true);

        var days = row.querySelector('.days');
        var time = row.querySelector('.time');
        var networks = row.querySelector('.networks');

        function createNetworkIcon(name) {
            var networkBlock = document.createElement('span');
            networkBlock.classList.add('icon');
            networkBlock.classList.add('icon-' + name);
            networks.appendChild(networkBlock);
        }

        if (rule.days.length === 0) {
            days.textContent = 'Каждый день';
        } else {
            days.textContent = rule.days.map(day => DAY_ABBR[day]).join(', ');
        }

        time.innerHTML = TimeHelper.formatPeriod(rule.start, rule.end);

        if (Object.keys(rule.sites).filter(k => rule.sites[k]).length === 0) {
            networks.textContent = 'Все';
        } else {
            Object.keys(rule.sites).filter(k => rule.sites[k]).forEach(createNetworkIcon);
        }

        row.dataset.number = number;

        rulesTable.appendChild(row);
    },

    table: function() {
        rulesTable.innerHTML = '';
        rulesContainer.storage.rules.forEach(this.row);
    }
};
