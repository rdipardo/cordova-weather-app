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
 * Wraps read/write actions on display preference options
 * @namespace PreferenceController
 */
const PreferenceController = (function () {

    return {

        /**
         * Retrieves the user's display preferences from local storage
         * @returns {Preference} A {@link Preference} object with properties
         * set to the user's display preferences
         * @memberof PreferenceController#
         */
        'get' () {
            return JSON.parse(window.localStorage.displayPreferences || '{}');
        },

        /**
         * Stores the user's display preferences in local storage
         * @param {Preference} prefs - An instance of {@link Preference}
         * @memberof PreferenceController#
         */
        'set' (prefs) {
            window.localStorage.displayPreferences = JSON.stringify(prefs);
        }
    };
}());
