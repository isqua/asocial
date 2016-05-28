'use strict';
(function() {
    var addButton = document.querySelector('#add-button');
    var addRuleForm = document.querySelector('#add-rule-form');

    addButton.addEventListener('click', function(evt) {
        evt.preventDefault();

        addButton.classList.toggle('hidden');
        addRuleForm.classList.toggle('showed');
    });
})();
