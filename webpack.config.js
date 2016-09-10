'use strict';

module.exports = [
    {
        entry: {
            vk: './asocial/src/content/networks/vk.js',
            fb: './asocial/src/content/networks/facebook.js',
            tw: './asocial/src/content/networks/twitter.js',
            ok: './asocial/src/content/networks/odnoklassniki.js'
        },

        output: {
            filename: 'asocial/content/[name].js'
        }
    },
    {
        entry: './asocial/src/options/options.js',

        output: {
            filename: 'asocial/options/options.js'
        }
    }
];
