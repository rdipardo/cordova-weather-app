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
 * Provides a CRUD interface to the Forecast table
 * @namespace ForecastController
 */
const ForecastController = (function () {

    return {

        /**
         * Adds a {@link Forecast} record to the database
         * @param {Forecast} values - The field values of a new {@link Forecast} record
         * @param {number} values.locationID - The row id of a saved {@link Location} record
         * @param {JSON} values.data - Weather data
         * @param {Date} values.lastUpdateTime - The timestamp of the given <code>data</code>
         * @memberof ForecastController#
         */
        'create' (values) {
            const dbContext = AppData;
            const dbHandle = dbContext.db;
            const sql = 'INSERT INTO forecast (' +
                'location, data, lastUpdated) ' +
                'VALUES (?, ?, DATETIME(?, \'localtime\'));';
            const parameters = Object.values(values);

            const executeCreate = function (tx) {
                const onSuccess = function () {
                    dbContext.onSuccess('Forecast storage')();
                }

                console.info('Storing forecast data . . .');
                tx.executeSql(sql, parameters, onSuccess, dbContext.onError);
            }

            if (dbHandle) {
                dbHandle.transaction(executeCreate, dbContext.onError, dbContext.onSuccess('Create statement'));
            }

        },

        /**
         * Returns the {@link Forecast} with the given <code>id</code>, joined with its related {@link Location}, to the given callback
         * @param {SQLTransactionCallback} callback - The function called if the query succeeds
         * @param {number} id - The row id the {@link Forecast} to search for
         * @memberof ForecastController#
         */
        'select' (callback, id) {
            const context = AppData;
            const dbHandle = context.db;
            const sql = 'SELECT loc.city, loc.latitude, loc.longitude, f.* ' +
                'FROM forecast f ' +
                'JOIN location loc ON f.location = loc.locationID ' +
                'WHERE f.location = ? ' +
                'ORDER BY f.lastUpdated DESC LIMIT 1;';

            const execute = function (tx) {
                console.info('Fetching forecast ...');
                tx.executeSql(sql, [id], callback, context.onError);
            }

            if (dbHandle) {
                dbHandle.readTransaction(execute, context.onError, context.onSuccess('Query'));
            }
        },

        /**
         * Returns every {@link Forecast}, with fields pulled from each related {@link Location}, to the given callback
         * @param {SQLTransactionCallback} callback - The function called if the query succeeds
         * @memberof ForecastController#
         */
        'index' (callback) {
            const context = AppData;
            const dbHandle = context.db;
            const sql = 'SELECT loc.city, loc.latitude, loc.longitude, f.* ' +
                'FROM forecast f ' +
                'JOIN location loc ON f.location = loc.locationID ' +
                'ORDER BY f.lastUpdated DESC;';

            const execute = function (tx) {
                console.info('Fetching saved forecasts . . .');
                tx.executeSql(sql, [], callback, context.onError);
            }

            if (dbHandle) {
                dbHandle.readTransaction(execute, context.onError, context.onSuccess('Query'));
            }
        }
    };
}());
