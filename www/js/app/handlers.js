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
 * Event handlers bound to UI components
 * @namespace Handlers
 */
const Handlers = (function () {

    return {

        /**
         * Simulates a lateral slide when changing screens
         * @callback Handlers#slideNavigate
         * @param {Event} event - A navigation event
         * @param {*} [data] - Any data sent by the event
         */
        'slideNavigate' (event, data) {
            let lastPage = '#';
            const lastPageIndex = $.mobile.navigate.history.activeIndex - 1;

            if (lastPageIndex > 0) {
                lastPage = $.mobile.navigate.history.stack[lastPageIndex].hash;
            }

            event.preventDefault();

            $.mobile.navigate(lastPage, {
                'transition': 'slide'
            });
        },

        /**
         * Shows or hides the GPS input controls
         * @callback Handlers#toggleLocationSearchControls
         */
        'toggleLocationSearchControls' () {
            if ($('#rdoCitySearch').prop('checked')) {
                $('#rngGPSSearch').hide();
                $('#txtCitySearch').show();
                this.txtCitySearch_TextChanged();
            } else {
                $('#rngGPSSearch').show();
                $('#txtCitySearch').hide();
                $('.ui-input-clear').trigger('click');
                $('#btnUpdateForcastLocation')[0].disabled = false;
            }
        },

        /**
         * Enables or disables the <code>Search</code> button depending on
         * whether the target input has a value
         * @callback Handlers#txtCitySearch_TextChanged
         */
        'txtCitySearch_TextChanged' () {
            $('#btnUpdateForcastLocation')[0].disabled =
                !$('#txtCity').val() && $('#rdoCitySearch').prop('checked');
        },

        /**
         * Launches an API request when the target button is pressed
         * @callback Handlers#btnUpdateForcastLocation_Click
         */
        'btnUpdateForcastLocation_Click' () {
            AppView.updateLocation();
        },

        /**
         * Populates the current forecast screen on view
         * @callback Handlers#dailyForecastPage_VisibleChanged
         */
        'dailyForecastPage_VisibleChanged' () {
            $('#currentConditions').html(
                '<div class="forecast forecast-data forecast-panel">' +
                '<span>Fetching weather data . . . </span>' +
                '<span class="fa fa-spinner fa-spin"></span></div>');

            ForecastWorker.getForecast(AppView.show);
        },

        /**
         * Populates the extended forecast screen on view
         * @callback Handlers#extendedForecastPage_VisibleChanged
         */
        'extendedForecastPage_VisibleChanged' () {
            $('#forecastOutlook').html(
                '<li class="forecast forecast-data forecast-panel">' +
                ' <span>Fetching forecasts . . . </span> ' +
                ' <span class="fa fa-spinner fa-spin"></span></li>');

            ForecastWorker.getForecast(AppView.show, true);
        },

        /**
         * Configures the display preference screen to show current settings on view
         * @callback Handlers#settingsPage_VisibleChanged
         */
        'settingsPage_VisibleChanged' () {
            AppView.loadPreferences();
        }
    }
}());
