/**
 * Copyright 2019-2021 rdipardo <dipardo.r@gmail.com>
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
 * Provides weather data to the app's domain layer
 * @namespace ForecastWorker
 */
const ForecastWorker = (function () {

    /** @private */
    const DEFAULT_PARAMS = `&units=metric&APPID=${ENV.OPENWEATHER_APPID}`;

    /** @private */
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';

    /** @private */
    const QUERY_BASE_URL = 'https://api.openweathermap.org/data/2.5/find?';

    /** @private */
    const EXTENDED_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?';

    /**
     * The maximum span of time to wait before the next API request
     * @memberof ForecastWorker#
     * @constant
     * @default
     */
    const CURRENCY_TIME_LIMIT = 60000;

    /** @private */
    const LOCATOR = {
        'options': {
            'enableHighAccuracy': false,
            'timeout': 60000,
            'maximumAge': 200
        },
        'onError' (err) {
            const msg = `Error [${err.code}]: ${err.message}`

            alert(msg);
            console.error(msg);
        }
    };

    /** @private */
    let timeSinceUpdate = 0;

    /**
     * Updates the time elapsed since the last request for weather data
     * about the current location
     * @param {string} [locationID] - The id, if any, of the active location's object model
     * @private
     */
    const updateForecast = function (locationID) {
        const id = locationID || window.localStorage.activeLocationID;

        const onSuccess = function (tx, recordSet) {
            const row = recordSet.rows[0] || {};

            if (row.forecastID) {
                timeSinceUpdate = new Date().getTime() - new Date(row.lastUpdated).getTime();
            }
        }

        ForecastController.select(onSuccess.bind(this), id);
    }

    /**
     * Converts raw weather data into the appropriate object models
     * before passing them to the database
     * @param {JSON} data - Weather data in JSON format
     * @returns {Boolean} `true` if a new record was created successfully
     * @private
     */
    const logForecastData = function (data) {
        const raw = JSON.stringify(data);
        const report = JSON.parse(raw);

        const reportError = () => {
            alert('Weather data for the selected location ' +
                'is currently unavailable!\n' +
                'Try again in a few minutes, try ' +
                'another location, or try a different search method.');
        }

        if (!report) {
            reportError();

            return false;
        }

        let location = {};
        let forecast = {};

        try {
            const isExtended = report.cnt && report.cnt > 5;
            const wasQuery =
                report.message && new RegExp(report.message, 'iu').test('accurate');

            if (isExtended) {
                location = new Location({
                    'locationID': report.city.id,
                    'city': report.city.name,
                    'country': report.city.country,
                    'latitude': report.city.coord.lat,
                    'longitude': report.city.coord.lon
                });

                forecast = report.list;

            } else if (wasQuery) {
                location = new Location({
                    'locationID': report.list[0].id,
                    'city': report.list[0].name,
                    'country': report.list[0].sys.country,
                    'latitude': report.list[0].coord.lat,
                    'longitude': report.list[0].coord.lon
                });
                forecast = { ...report.list[0] };

            } else {
                location = new Location({
                    'locationID': report.id,
                    'city': report.name,
                    'country': report.sys.country,
                    'latitude': report.coord.lat,
                    'longitude': report.coord.lon
                });
                forecast = report;
            }

        } catch (_) {
            reportError();
        }

        const foreignKeyGetter = function (tx, recordSet) {
            const row = recordSet.rows[0] || {};

            if (row.locationID) {
                window.localStorage.activeLocationID = row.locationID;

                ForecastController.create(
                    new Forecast({
                        'locationID': row.locationID,
                        'data': JSON.stringify(forecast),
                        'lastUpdateTime': new Date().toISOString()
                    }));
            }
        }

        const responseCode = report.cod;

        if (parseInt(responseCode, 10) === 200) {
            if (!location.locationID) {
                reportError();

                return false;
            }

            LocationController.create(location, foreignKeyGetter);
            timeSinceUpdate = 0;
            setInterval(updateForecast, CURRENCY_TIME_LIMIT);

            return true;
        } else if (parseInt(responseCode, 10) === 404) {
            reportError();
        } else {
            alert(`Weather service responded with code ${responseCode}`);
        }

        return false;
    }

    /**
     * Generates a callback that can be passed to a client function requiring geolocation data
     * @param {function} callback - A client function to be called when forecast data becomes available
     * @param {string} [request] - A query string
     * @returns {function(Geolocation): void} A callback accepting a Geolocation object
     * @private
     */
    const doGet = function (callback, request) {
        const reportError = err => {
            if (parseInt(err.status, 10) === 404) {
                alert('Weather data currently unavailable!\n' +
                    'Try again in a few minutes, or try searching by GPS.');
            } else {
                alert(`Request failed with code: ${err.status}`);
            }

            console.error(`Request failed with code: ${err.status}`);
        }

        return function (position) {
            let extendedForecast = false;

            if (!request) {
                request =
                    encodeURI(
                        `${BASE_URL}lat=${position.coords.latitude}` +
                        `&lon=${position.coords.longitude}` +
                        `${DEFAULT_PARAMS}`);
            } else if (new RegExp(EXTENDED_BASE_URL, 'iu').test(request)) {
                extendedForecast = true;
            }

            $.ajax({
                'url': request,
                'type': 'GET',
                'cache': true,
                'dataType': 'json',
                'success' (data) {
                    new Promise((res, _) => {
                        if (logForecastData.bind(this)(data)) {
                            res();
                        }
                    })
                        .then(callback.bind(this, extendedForecast))
                        .catch(err => reportError(err || {
                            'status': '404'
                        }));
                },
                'error' (errorData) {
                    reportError(errorData);
                }
            });
        }
    }

    /**
     * Prepares weather data for display
     * @param {WeatherReading} reading - An initialized forecast object
     * @returns {WeatherReading} A formatted forecast object
     * @private
     */
    const formatData = function (reading) {
        const truncate = val => {
            const parsedTemp = parseFloat(val).toFixed(0);

            return Math.abs(parsedTemp) === 0 ? 0 : parsedTemp;
        }

        const celsiusToFahrenheit = val => {
            const tempInFahrenheit = parseFloat(val) * 9 / 5 + 32;

            return `${truncate(parseFloat(val) * 9 / 5 + 32)} \u00B0F`;
        }

        const millimetersToInches = val => {
            return `${(parseFloat(val) * 0.039370).toFixed(2)} inches`;
        }

        const metersPerSecondToMilesPerHour = val => {
            return `${truncate(parseFloat(val) * 3600 / 1609.344)} miles/hr`;
        }
        const format = PreferenceController.get();

        reading.brief = reading.brief.replace('_', ' ').toUpperCase();
        reading.temp = `${truncate(reading.temp)} \u00B0C`;
        reading.high = `${truncate(reading.high)} \u00B0C`;
        reading.low = `${truncate(reading.low)} \u00B0C`;
        reading.windSpeed = `${truncate(reading.windSpeed)} meters/sec`;

        if (reading.rainAmount) {
            reading.rainAmount = `${truncate(reading.rainAmount)} mm`;
        }

        if (reading.snowAmount) {
            reading.snowAmount = `${truncate(reading.snowAmount)} mm`;
        }

        if (format) {
            if (format.preferredTempScale === 'IMP') {
                reading.temp = celsiusToFahrenheit(reading.temp);
                reading.high = celsiusToFahrenheit(reading.high);
                reading.low = celsiusToFahrenheit(reading.low);
            }
            if (format.preferredWindScale === 'IMP') {
                reading.windSpeed = metersPerSecondToMilesPerHour(reading.windSpeed);
            }

            if (reading.rainAmount && format.preferredPrecipitationScale === 'IMP') {
                reading.rainAmount = millimetersToInches(reading.rainAmount)

            }
            if (reading.snowAmount && format.preferredPrecipitationScale === 'IMP') {
                reading.snowAmount = millimetersToInches(reading.rainAmount)
            }
        }

        return reading;
    }

    return {

        /**
         * Launches an API request for weather data. If given, the location
         * provided by <code>requestParams</code> will be looked up, otherwise
         * the current device location
         * @param {function} callback - A client function to be called on the retrieved data
         * @param {boolean} [extended=false] - Whether or not a long range forecast is requested
         * @param {APIRequest} [requestParams={}] - Location attributes to be queried
         * @memberof ForecastWorker#
         */
        'getForecast' (callback, extended = false, requestParams = {}) {
            const id = window.localStorage.activeLocationID;
            let request = null;
            let reqHandler = null;

            if (requestParams.city) {
                request =
                    encodeURI(`${QUERY_BASE_URL}q=${requestParams.city}` +
                              `${DEFAULT_PARAMS}`);
            } else if (requestParams.gps) {
                request =
                    encodeURI(`${BASE_URL}lat=${requestParams.gps.latitude}` +
                              `&lon=${requestParams.gps.longitude}` +
                              `${DEFAULT_PARAMS}`);
            }

            if (request) {
                doGet(callback, request)();

                return;
            }



            if (id && id > 0) {
                reqHandler =
                    doGet(callback,
                        encodeURI(`${extended ? EXTENDED_BASE_URL : BASE_URL}id=${id}${DEFAULT_PARAMS}`));
            } else if (extended) {
                reqHandler = doGet(callback, EXTENDED_BASE_URL);
            } else {
                reqHandler = doGet(callback);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(reqHandler.bind(this), LOCATOR.onError, LOCATOR.options);
            } else {
                alert('Geolocation unavailable or not supported');
                console.error('Geolocation unavailable or not supported');
            }

        },

        /**
         * Exposes formatted weather data to the UI controls
         * @param {function} callback - A client function requiring weather data
         * @param {boolean} [extended] - Whether or not a long range forecast is expected
         * @memberof ForecastWorker#
         */
        'getCurrentReport' (callback, extended) {
            const id = window.localStorage.activeLocationID;

            const dailyForecastHandler = function (tx, recordSet) {
                const row = recordSet.rows[0] || {};

                if (row.forecastID) {
                    const conditions = JSON.parse(row.data);
                    const weatherReport = formatData(
                        new WeatherReading({
                            'city': row.city,
                            'latitude': row.latitude,
                            'longitude': row.longitude,
                            'currency': new Date(parseInt(conditions.dt, 10) * 1000).getHours(),
                            'brief': conditions.weather[0].description,
                            'temp': conditions.main.temp,
                            'low': conditions.main.temp_min,
                            'high': conditions.main.temp_max,
                            'windSpeed': conditions.wind.speed,
                            'windDir': conditions.wind.deg,
                            'rainAmount': conditions.rain,
                            'snowAmount': conditions.snow,
                            'longRange': false
                        }));

                    callback(weatherReport, id);

                } else {
                    timeSinceUpdate = CURRENCY_TIME_LIMIT;
                    alert('Error fetching forecast data! Try reloading the page.')
                }
            }

            const extendedForecastHandler = function (tx, recordSet) {
                const row = recordSet.rows[0] || {};

                if (row.forecastID) {
                    const todayCode = new Date().getDay();
                    const conditions = JSON.parse(row.data);
                    let entries =
                        Array.prototype.slice.apply(conditions)
                            .map(forecast => {
                                const nextDay = new Date(parseInt(forecast.dt, 10) * 1000).getDay();
                                let futureReport = null;

                                switch (Math.abs(todayCode - nextDay)) {
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                    futureReport = formatData(
                                        new WeatherReading({
                                            'city': row.city,
                                            'latitude': row.latitude,
                                            'longitude': row.longitude,
                                            'currency': nextDay,
                                            'brief': forecast.weather[0].description,
                                            'temp': forecast.main.temp,
                                            'low': forecast.main.temp_min,
                                            'high': forecast.main.temp_max,
                                            'windSpeed': forecast.wind.speed,
                                            'windDir': forecast.wind.deg,
                                            'rainAmount': forecast.rain ? forecast.rain['3h'] : null,
                                            'snowAmount': forecast.snow ? forecast.snow['3h'] : null,
                                            'longRange': true
                                        }));
                                    break;
                                default:
                                    break;
                                }

                                return futureReport;
                            })
                            .filter(forecast => forecast);

                    const returnVal = [];

                    // Save only one forecast per day
                    entries = Object.values(entries.reduce((obj, forecast) => {
                        returnVal.push(obj[forecast.currency] = forecast);

                        return obj;
                    }, {}));

                    callback(returnVal.filter(entry => entries.includes(entry)), id);
                } else {
                    timeSinceUpdate = CURRENCY_TIME_LIMIT;
                    alert('Error fetching forecast data! Try reloading the page.')
                }
            }

            if (extended) {
                ForecastController.select(extendedForecastHandler.bind(this), id);
            } else {
                ForecastController.select(dailyForecastHandler.bind(this), id);
            }
        },

        /**
         * Sets the age of the current location's data to
         * {@link CURRENCY_TIME_LIMIT}, triggering a new API request
         * @memberof ForecastWorker#
         */
        'expire' () {
            timeSinceUpdate = CURRENCY_TIME_LIMIT;
        },

        /**
         * <code>true</code> if the time elapsed since the last API request is
         * within the {@link CURRENCY_TIME_LIMIT}
         * @type {boolean}
         * @memberof ForecastWorker#
         */
        get 'isCurrent' () {
            return timeSinceUpdate < CURRENCY_TIME_LIMIT;
        }
    };
}());
