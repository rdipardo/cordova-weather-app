/**
 * Copyright 2019-2020 rdipardo <dipardo.r@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Maps a weather forecast description to an appropriate icon
 * @see https://erikflowers.github.io/weather-icons/api-list.html
 * @param {WeatherReading} reading - A weather forecast object
 * @returns {string} A keyword matching a CSS class name in the icon set
 */
const fetchWeatherIcon = function (reading) {
    const desc = reading.brief || '';
    const hour = reading.currency;
    const extended = reading.longRange || false;

    if ((/(.*clear.*)/iu).test(desc) ||
        (/(sun\w*)/iu).test(desc)) {
        return hour > 6 && hour < 18 || extended ? 'sunny' : 'clear';
    } else if ((/(.*cloud.*)/iu).test(desc) || (/(.*overcast.*)/iu).test(desc)) {
        return (/(.*partly.*)/iu).test(desc) ||
                (/(.*light.*)/iu).test(desc) ?
            'partly-cloudy' :
            'cloudy';
    } else if ((/(.*rain.*)/iu).test(desc) || (/(.*shower.*)/iu).test(desc)) {
        return (/.*light.*/iu).test(desc) ? 'sprinkle' : 'showers';
    } else if ((/(.*snow.*)/iu).test(desc)) {
        return 'snow';
    } else if ((/.*sleet.*/iu).test(desc)) {
        return 'rain-mix';
    } else if ((/.*thunder.*/iu).test(desc)) {
        return 'thunderstorm';
    } else if ((/(fog)/iu).test(desc) || (/(mist)/iu).test(desc)) {
        return 'fog';
    }

    return 'clear';
}

/**
 * Returns the next day's date as a formatted string
 * @param {number} offset - The number of days to advance
 * @returns {string} A formatted date string
 */
const getNextDate = function (offset) {
    const today = new Date();
    const thirtyDayMonths = [3, 5, 8, 10];
    const leapYear = year => year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
    const daysFwd = today.getDate() + offset;
    const thisMon = today.getMonth();
    let tommorrow = new Date(today.setDate(daysFwd));

    if (thisMon in thirtyDayMonths && daysFwd > 30 ||
        thisMon === 1 && daysFwd > 28 && !leapYear(today.getFullYear()) ||
        thisMon === 1 && daysFwd > 29 && leapYear(today.getFullYear()) ||
        daysFwd > 31) {

        let lastDay = 31;

        if (thisMon in thirtyDayMonths) {
            lastDay = 30;
        } else if (thisMon === 1) {
            if (leapYear(today.getFullYear())) {
                lastDay = 29;
            } else {
                lastDay = 28;
            }
        }

        tommorrow = new Date(tommorrow.setMonth(thisMon + 1));
        tommorrow = tommorrow.setDate(daysFwd - lastDay);
    }

    return new Date(tommorrow).toLocaleDateString('en-CA', {
        'weekday': 'long',
        'month': 'long',
        'day': 'numeric'
    });
}
