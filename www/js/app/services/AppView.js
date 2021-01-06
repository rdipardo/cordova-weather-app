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
 * Exposes data access layer functions to the app's UI controls
 * @namespace AppView
 */
const AppView = (function () {

    $.validator.addMethod('cityNamePattern',

        /**
         * Provides the jQuery validator with city name validation
         * @callback jQuery.validator.cityNamePattern
         * @memberof! AppView#
         * @param {string} value - The value of the input control
         * @param {HTMLInputElement} element - A reference to the input object
         * @returns {bool} <code>true</code> if <code>value</code> is non-null and matches the pattern
         */
        function (value, element) {
            const pattern = /^[^\d*\W*_](\w*\W*?)+$/u;

            return this.optional(element) || pattern.test(value);
        },
        'Please enter a valid city name');

    /**
     * Clears the error state of a form that failed to validate.
     * @param {jQuery} form - The form that failed to validate
     * @return {function():void} A callback that clears the form's error state
     * @fires jQuery.validator.resetForm
     * @fires jQuery.validator.reset
     * @private
     */
    const cancelSubmit = function (form) {
        return function () {
            const validator = form.validate();

            validator.resetForm();
            validator.reset();
            form[0].reset();
        }
    }

    /**
     * Updates main display with the current forecast
     * @private
     */
    const showCurrentConditions = function () {

        /**
         * Updates screen with the most recent weather data for the currently
         * selected city
         * @param {WeatherReading} reading - An initialized forecast object
         * @param {number} locationID - The identifier of the currently selected city
         */
        const onSuccess = function (reading, locationID) {
            const amOrPM =
                reading.currency > 6 && reading.currency < 18 ? 'day' : 'night';
            let report =
                `<div data-row-id="${locationID}" class="forecast forecast-data forecast-panel">` +
                `<div><i class="wi wi-${amOrPM}-${fetchWeatherIcon(reading) || 'cloudy'}"></i></div>` +
                `<div><p>${reading.brief}</p>` +
                `<p>${reading.temp}</p></div>` +
                `<div><span>High:&nbsp;${reading.high}</span></div>` +
                `<div><span>Low:&nbsp;${reading.low}</span></div>` +
                '<div><span>Wind:&nbsp;' +
                `<i class="wi wi-wind towards-${reading.windDir}-deg"></i></span>` +
                `<span>&nbsp;${reading.windSpeed}</span></div>` +
                `<div><p class="current-city"><strong>${reading.city}</strong></p>` +
                `<p class="current-location">(${reading.latitude},&nbsp;${reading.longitude})</p>`;

            if (reading.rainAmount && parseFloat(reading.rainAmount) > 0) {
                report += `<div class="inset"><span>${reading.rainAmount}</span>`;
                if (reading.snowAmount && parseFloat(reading.snowAmount) > 0) {
                    report += `<span>${reading.snowAmount}</span></div>`;
                } else {
                    report += '</div>'
                }
            }

            $('#currentConditions').html(report);
        }

        ForecastWorker.getCurrentReport(onSuccess);
    }

    /**
     * Queries and returns a list of forecasts projecting five days ahead
     * @private
     */
    const showExtendedForecast = function () {

        /**
         * Generates a forecast card for each of the next five days
         * @param {Array<WeatherReading>} collection - An initialized forecast object
         * @param {number} locationID - The identifier of the currently selected city
         */
        const onSuccess = function (collection, locationID) {
            const forecasts =
                Object.values(collection).reduce((html, forecast, idx) => {
                    const rain = forecast.rainAmount && parseFloat(forecast.rainAmount) > 0 ?
                        `<div><span>Rain:&nbsp;${forecast.rainAmount}</span></div>` :
                        '';
                    const snow = forecast.snowAmount && parseFloat(forecast.snowAmount) > 0 ?
                        `<div><span>Snow:&nbsp;${forecast.snowAmount}</span></div>` :
                        '';

                    return html +=
                        `<li data-row-id="${idx}" class="forecast forecast-data forecast-panel brief">` +
                        `<h3>${getNextDate(idx)}</h3>` +
                        `<div><i class="wi wi-day-${fetchWeatherIcon(forecast) || 'cloudy'}"></i></div>` +
                        `<p>${forecast.brief}</p>` +
                        `<p>${forecast.temp}</p>` +
                        `${rain}${snow}` +
                        '<div><span>Wind:&nbsp;' +
                        `<i class="wi wi-wind towards-${forecast.windDir}-deg"></i></span>` +
                        `<span>&nbsp;${forecast.windSpeed}</span></div></li>`;
                }, '');

            $('#forecastOutlook').html(forecasts);

            if (collection && collection[0].city) {
                $('#outlookCity').html(`The week in <strong>${collection[0].city}</strong>`);
                $('#outlookCity').show();
            } else {
                $('#outlookCity').hide();
            }
        }

        ForecastWorker.getCurrentReport(onSuccess, true);
    }

    /**
     * Queries and returns a list of previously entered city names
     * @private
     */
    const getSearchedCities = function () {
        const onSuccess = function (tx, recordSet) {
            const row = recordSet.rows[0] || {};

            if (row.locationID) {
                const listing =
                    Array.prototype.slice.apply(recordSet.rows)
                        .reduce((html, loc) => {
                            return html +=
                            `<li class="ui-screen-hidden"><a href="#">${loc.city},${loc.country}</a></li>`
                        }, '');

                $('#searchedCities').html(listing)
                    .children('li')
                    .each(function () {
                        $(this).on('click touchstart', function () {
                            const opt = $(this).text().trim();

                            if (opt.length) {
                                $('#txtCity').val(opt);
                            }
                        })
                    })
            }
        }

        LocationController.index(onSuccess);
    }

    return {

        /**
         * Updates the weather forecast display
         * @param {boolean} [extendedForecast] - Whether or not a long range forecast is requested
         * @memberof AppView#
         */
        'show' (extendedForecast) {
            if (extendedForecast) {
                setTimeout(showExtendedForecast, 200);
            } else {
                setTimeout(() => {
                    showCurrentConditions();
                    getSearchedCities();
                }, 300);
            }
        },

        /**
         * Passes a validated city name or set of GPS coordinates to the API request handler
         * @see ForecastWorker#getForecast
         * @fires jQuery.validate
         * @fires jQuery.validate.submitHandler
         * @memberof AppView#
         */
        'updateLocation' () {
            $('#chooseLocationForm').validate({
                'rules': {
                    'txtCity': {
                        'required': '#rdoCitySearch:checked',
                        'cityNamePattern': true
                    },
                    'rngLat': {
                        'required': '#rdoGPSSearch:checked',
                        'min': -90,
                        'max': 90,
                        'number': true
                    },
                    'rngLong': {
                        'required': '#rdoGPSSearch:checked',
                        'min': -180,
                        'max': 180,
                        'number': true
                    }
                },
                'messages': {
                    'txtCitySearch': {
                        'required': 'Please enter the name of a city',
                        'cityNamePattern': 'Please enter a valid city name'
                    },
                    'rngLat': {
                        'required': 'A latitude value is required',
                        'min': 'Latitude must be between -90 and 90 degrees',
                        'max': 'Latitude must be between -90 and 90 degrees'
                    },
                    'rngLong': {
                        'required': 'A longitude value is required',
                        'min': 'Longitude must be between -180 and 180 degrees',
                        'max': 'Longitude must be between -180 and 180 degrees'
                    }

                },
                'submitHandler' (form) {
                    const selectedCity = `${$('#txtCity').val()} `.trim();
                    const lat = `${$('#rngLat').val()}`.trim();
                    const lon = `${$('#rngLong').val()}`.trim();
                    const req = new APIRequest({
                        'city': selectedCity,
                        'latitude': lat,
                        'longitude': lon
                    });

                    ForecastWorker.getForecast(AppView.show, false, req);
                    $('#txtCity').val('');
                }
            });

            if ($('#chooseLocationForm').valid()) {
                $('#chooseLocationForm').submit();
            } else {
                $('a').one('click touchstart', cancelSubmit($('#chooseLocationForm')));
            }
        },

        /**
         * Passes validated display preference values to local storage
         * @fires jQuery.validate
         * @fires jQuery.validate.submitHandler
         * @memberof AppView#
         */
        'updatePreferences' () {
            $('#settingsForm').validate({
                'rules': {
                    'rdoTempScale': {
                        'required': true
                    },
                    'rdoWindScale': {
                        'required': true
                    },
                    'rdoPrecipScale': {
                        'required': true
                    }
                },
                'messages': {
                    'rdoTempScale': 'Please choose a temperature scale!',
                    'rdoWindScale': 'Please choose a speed scale!',
                    'rdoPrecipScale': 'Please choose a unit of measurement!'
                },
                'submitHandler' (form) {
                    let message = 'Your preferences have been saved!';

                    try {
                        PreferenceController.set(
                            new Preference({
                                'temp': $('#settingsForm :input[name="rdoTempScale"]:checked').val(),
                                'wind': $('#settingsForm :input[name="rdoWindScale"]:checked').val(),
                                'precip': $('#settingsForm :input[name="rdoPrecipScale"]:checked').val()
                            }));
                    } catch (e) {
                        message = `Saving preferences failed with the message: ${e.message}.`;
                    }

                    if (!window.localStorage.displayPreferences) {
                        message = 'Unable to save preferences.';
                    }

                    // Only fresh data will be formatted, so force the main page to fetch some
                    ForecastWorker.expire();
                    alert(message);
                }
            });

            if ($('#settingsForm').valid()) {
                $('#settingsForm').submit();
            } else {
                $('a').one('click touchstart', cancelSubmit($('#settingsForm')));
            }
        },

        /**
         * Ensures the UI reflects the current state of any user-defined display preferences
         * @memberof AppView#
         */
        'loadPreferences' () {
            const preferences = PreferenceController.get();

            if (preferences) {
                if (preferences.preferredTempScale === 'IMP') {

                    /*
                     * If attempted during page load, calling the
                     * #checkboxradio may throw an error; in any
                     * case, make sure the inputs are initialized!
                     */
                    try {
                        $('#rdoMetricTemp').prop('checked', false)
                            .checkboxradio('refresh');
                        $('#rdoImperialTemp').prop('checked', true)
                            .checkboxradio('refresh');
                    } catch (_) {
                        $('#rdoMetricTemp').prop('checked', false);
                        $('#rdoImperialTemp').prop('checked', true);
                    }
                }

                if (preferences.preferredWindScale === 'IMP') {
                    try {
                        $('#rdoMetricWind').prop('checked', false)
                            .checkboxradio('refresh');
                        $('#rdoImperialWind').prop('checked', true)
                            .checkboxradio('refresh');
                    } catch (_) {
                        $('#rdoMetricWind').prop('checked', false);
                        $('#rdoImperialWind').prop('checked', true);
                    }
                }

                if (preferences.preferredPrecipitationScale === 'IMP') {
                    try {
                        $('#rdoMetricPrecip').prop('checked', false)
                            .checkboxradio('refresh');
                        $('#rdoImperialPrecip').prop('checked', true)
                            .checkboxradio('refresh');
                    } catch (_) {
                        $('#rdoMetricPrecip').prop('checked', false);
                        $('#rdoImperialPrecip').prop('checked', true);
                    }
                }
            }
        },

        /**
         * Restores display preferences to their default state
         * @memberof AppView#
         */
        'clearPreferences' () {
            PreferenceController.set(null);
            $('#rdoMetricTemp').prop('checked', true)
                .checkboxradio('refresh');
            $('#rdoImperialTemp').prop('checked', false)
                .checkboxradio('refresh');
            $('#rdoMetricWind').prop('checked', true)
                .checkboxradio('refresh');
            $('#rdoImperialWind').prop('checked', false)
                .checkboxradio('refresh');
            $('#rdoMetricPrecip').prop('checked', true)
                .checkboxradio('refresh');
            $('#rdoImperialPrecip').prop('checked', false)
                .checkboxradio('refresh');
        }
    };
}());
