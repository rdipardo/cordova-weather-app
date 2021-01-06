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

/** @ignore */
const initForms = () => {
    $('input')
        .not('[type=checkbox]')
        .not('[type=radio]')
        .not('[readonly]')
        .each(function () {
            $(this).on('click focus', function () {
                $(this).select()
            });
        });
    $('input:radio[name="rdoSearchType"]').change(Handlers.toggleLocationSearchControls.bind(Handlers));
    $('#txtCity').on('keyup input change', Handlers.txtCitySearch_TextChanged);
    $('#rngGPSSearch').hide();
}

/** @ignore */
const initPage = () => {
    $('#btnUpdateForcastLocation').click(Handlers.btnUpdateForcastLocation_Click);
    $('#btnSavePreferences').click(AppView.updatePreferences);
    $('#btnClearPreferences').click(AppView.clearPreferences);
    $('a.ui-icon-carat-l').click(Handlers.slideNavigate);
    $('footer div ul li a[href="#dailyForecastPage"]').click(Handlers.dailyForecastPage_VisibleChanged);
    $('footer div ul li a[href="#extendedForecastPage"]').click(Handlers.extendedForecastPage_VisibleChanged);
    $('footer div ul li a[href="#settingsPage"]').click(Handlers.settingsPage_VisibleChanged);
    $('footer div ul li a[href="#aboutPage"]').click(Handlers.settingsPage_VisibleChanged);

    // If reloading while on the settings page is showing
    AppView.loadPreferences();
    initForms();
}

$(() => {
    const onDeviceReady = function () {
        AppData.initialize();
        initPage();
        ForecastWorker.getForecast(AppView.show);
    }

    document.addEventListener('deviceready', onDeviceReady, false);
});
