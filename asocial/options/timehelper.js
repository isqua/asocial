/* exported TimeHelper */
'use strict';

var TimeHelper = {
    parse: function(str) {
        var timePattern = /^([0-9]{1,2})[.:, ]?([0-9]{2})/;
        var times = timePattern.exec(str);

        if (times) {
            var hours = parseInt(times[1], 10);
            var minutes = parseInt(times[2], 10);

            hours = Math.min(hours, 23);
            minutes = Math.min(minutes, 59);

            return [hours, minutes];
        }

        return null;
    },

    formatItem: function(time) {
        return String(time < 10 ? '0' + time : time);
    },

    formatTime: function(array) {
        return array ? array.map(this.formatItem).join(':') : '';
    },

    formatPeriod: function(start, end) {
        if (start && end) {
            return this.formatTime(start) + '&thinsp;—&thinsp;' + this.formatTime(end);
        } else if (start && !end) {
            return 'С ' + this.formatTime(start);
        } else if (!start && end) {
            return 'До ' + this.formatTime(end);
        }

        return 'Весь день';
    }
};
