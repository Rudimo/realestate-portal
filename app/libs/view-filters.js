'use strict';

/**
 * Application constants
 */
const c = require('../constants');

module.exports = {
    /**
     * Format price: 2000000 -> 2 000 000
     *
     * Usage in swig: {{ item.price | price }}
     */
    'price': input => {
        if (typeof input != 'number') return '?';

        input = parseFloat(input.toFixed(2));

        let afterDot;

        input += ''; // To string

        if (input.indexOf('.') > -1) {

            afterDot = input.split('.')[1];

            input = input.split('.')[0];
        }

        let output = '';
        let len = input.length;
        let i = len;

        while (i > 0) {
            if (!(i % 3)) {
                output += ' ';
            }
            output += input[len - i];
            i--;
        }

        if (afterDot) {

            output += '.' + afterDot;
        }

        return output;
    },

    /**
     * Format number: 123456.23 -> 123 321.23
     *
     * Usage in swig: {{ number | numberFormat }}
     */
    'numberFormat': numberFormat,

    /**
     * Format phone: 9200240022 -> +7 (920) 024 00 22
     *
     * Usage in swig:{{ item.phone | phone }}
     */
    'phone': input => {
        if (typeof input != 'string') return '?';

        return input.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "+7 ($1) $2 $3 $4");
    },

    'limit': (input, limit) => {
        if (typeof input != 'string') return '';

        if (input.length <= limit) {
            return input;
        }

        let trimmedString = input.substr(0, limit);

        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
        trimmedString += ' ...';

        return trimmedString;
    },

    'secondsToTimeString': duration => {

        let sec_num = parseInt(duration, 10); // don't forget the second param
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    },

    'millisecondsToTimeString': duration => {

        let milliseconds = parseInt((duration % 1000) / 100)
            , seconds    = parseInt((duration / 1000) % 60)
            , minutes    = parseInt((duration / (1000 * 60)) % 60)
            , hours      = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours   = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        //return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
        return hours + ':' + minutes + ':' + seconds;
    },

    // 65 -> 00065
    zeroFill: (input, length) => {

        let str = input + '';

        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    },

    // 3 квартиры, 11 квартир
    textual: (number, many, one, two, prependNumber) => {
        let n = parseInt(number);
        let text;

        if (n % 100 === 1 || (n % 100 > 20) && (n % 10 === 1)) {
            text = one;
        } else if (n % 100 === 2 || (n % 100 > 20) && (n % 10 === 2)) {
            text = two;
        } else if (n % 100 === 3 || (n % 100 > 20) && (n % 10 === 3)) {
            text = two;
        } else if (n % 100 === 4 || (n % 100 > 20) && (n % 10 === 4)) {
            text = two;
        } else {
            text = many;
        }

        if (prependNumber) {
            text = numberFormat(n) + ' ' + text;
        }

        return text;
    }
};

function numberFormat(input) {
    if (typeof input != 'number') return '?';

    input = parseFloat(input.toFixed(2));

    let afterDot;

    input += ''; // To string

    if (input.indexOf('.') > -1) {

        afterDot = input.split('.')[1];

        input = input.split('.')[0];
    }

    let output = '';
    let len    = input.length;
    let i      = len;

    while (i > 0) {
        if (!(i % 3)) {
            output += ' ';
        }
        output += input[len - i];
        i--;
    }

    if (afterDot) {

        output += '.' + afterDot;
    }

    return output;
}