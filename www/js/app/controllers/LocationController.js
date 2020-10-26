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
 * Provides a CRUD interface to the Location table
 * @namespace LocationController
 */
const LocationController = (function () {

    return {

        /**
         * Adds a {@link Location} to the database
         * @param {Location} values - The field values of a new {@link Location}
         * @param {number} values.locationID - The row id of a new {@link Location} record
         * @param {string} values.city - The name of a city
         * @param {string} values.country - The country code of this {@link Location}
         * @param {number} values.latitude - GPS latitude of a city
         * @param {number} values.longitude - GPS longitude of a city
         * @param {SQLTransactionCallback} callback - The function called if the transaction succeeds
         * @memberof LocationController#
         */
        'create' (values, callback) {
            const dbContext = AppData;
            const dbHandle = dbContext.db;
            const sql = 'INSERT INTO location (' +
                'locationID, city, country, latitude, longitude) ' +
                'VALUES (?, ?, ?, ?, ?);';

            const parameters = Object.values(values);
            const [id = 0] = parameters;

            const onFKConstraintError = function (tx, error) {

                /**
                 * @hack we can't save the same location twice, but
                 * since we've coupled this action with
                 * ForecastController#create, let the transaction
                 * return the existing FK to the caller
                 */
                if (error.code === 6) {
                    console.info('Location already in database.');
                    this.select(callback, id);
                }
            }

            const executeCreate = function (tx) {
                const onSuccess = () => {
                    dbContext.onSuccess('Location storage')();
                    this.select(callback, id);
                }

                console.info('Storing location ...');
                tx.executeSql(sql, parameters, onSuccess, onFKConstraintError.bind(this));
            }

            if (dbHandle && id > 0) {
                dbHandle.transaction(executeCreate.bind(this), dbContext.onError, dbContext.onSuccess('Create statement'));
            }
        },

        /**
         * Returns all {@link Location} records to the given callback
         * @param {SQLTransactionCallback} callback - The function called if the transaction succeeds
         * @memberof LocationController#
         */
        'index' (callback) {
            const context = AppData;
            const dbHandle = context.db;
            const sql = 'SELECT * FROM location';

            const executeIndex = function (tx) {
                console.info('Fetching all searched locations . . .');
                tx.executeSql(sql, [], callback, context.onError);
            }

            if (dbHandle) {
                dbHandle.readTransaction(executeIndex, context.onError, context.onSuccess('Query'));
            }
        },

        /**
         * Returns the {@link Location} with the given id to the given callback
         * @param {SQLTransactionCallback} callback - The function called if the transaction succeeds
         * @param {string} id - The id of a {@link Location}
         * @memberof LocationController#
         */
        'select' (callback, id) {
            const context = AppData;
            const dbHandle = context.db;
            const sql = 'SELECT * FROM location WHERE locationID = ?';

            const execute = function (tx) {
                console.info('Fetching location ...');
                tx.executeSql(sql, [id], callback, context.onError);
            }

            if (dbHandle) {
                dbHandle.readTransaction(execute, context.onError, context.onSuccess('Query'));
            }
        }
    };
}());
