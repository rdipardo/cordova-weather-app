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
 * Provides readonly access to the app's database
 * @namespace AppData
 */
const AppData = (function () {

    /** @private */
    let db = null;

    /** @private */
    const locationTableDDL = {
        'create': 'CREATE TABLE IF NOT EXISTS location ( ' +
        'locationID     INTEGER NOT NULL PRIMARY KEY, ' +
        'city           TEXT, ' +
        'country        TEXT, ' +
        'latitude       REAL NOT NULL, ' +
        'longitude      REAL NOT NULL);',
        'drop': 'DROP TABLE IF EXISTS location'
    };

    /** @private */
    const forecastTableDDL = {
        'create': 'CREATE TABLE IF NOT EXISTS forecast ( ' +
        ' forecastID    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        ' location      INTEGER NOT NULL, ' +
        ' data          TEXT, ' +
        'lastUpdated    DATE, ' +
        'FOREIGN KEY(location) REFERENCES location(locationID));',
        'drop': 'DROP TABLE IF EXISTS forecast;'
    }

    /**
     * Creates new tables in the database
     * @param {AppData} context - A reference to the enclosing namespace
     * @private
     */
    const create = function (context) {
        const executor = function (tx) {
            console.info('Preparing Location table...');
            tx.executeSql(locationTableDDL.drop, [], context.onSuccess('Table deletion'), context.onError);
            tx.executeSql(locationTableDDL.create, [], context.onSuccess('Table creation'), context.onError);

            console.info('Preparing Forecast table...');
            tx.executeSql(forecastTableDDL.drop, [], context.onSuccess('Table deletion'), context.onError);
            tx.executeSql(forecastTableDDL.create, [], context.onSuccess('Table creation'), context.onError);
        }

        if (db) {
            db.transaction(executor, context.onError, context.onSuccess('Table initialization'));
        }
    }

    /**
     * Drops all tables from the database
     * @param {AppData} context - A reference to the enclosing namespace
     * @private
     */
    const drop = function (context) {

        const executeDrop = function (tx) {
            console.info('Dropping tables...');
            tx.executeSql(locationTableDDL.drop, [], context.onSuccess('Table deletion'), context.onError);
            tx.executeSql(forecastTableDDL.drop, [], context.onSuccess('Table deletion'), context.onError);
        }

        const onSuccess = function () {
            context.onSuccess('Database purge')();
        }

        if (db) {
            db.transaction(executeDrop, context.onError, onSuccess);
        }
    }

    return {

        /**
         * Initializes the database
         * @memberof AppData#
         */
        'initialize' () {
            const name = 'appData';
            const description = 'Persistent storage for the Weather Wizard Android App';
            const size = 2 * 1024 * 1024;

            try {
                db = openDatabase(name, '1.0', description, size, this.onSuccess('Database connection'));

                if (db) {
                    create(this);
                } else {
                    throw new Error('Failed to open database!');
                }
            } catch (e) {
                if (e.name === 'ReferenceError') {
                    const msg = 'Your device does not support WebSQL!';

                    alert(msg);
                    console.error(msg);
                } else if (e.name === 'SecurityError') {
                    const msg = `Access to local storage was denied.${'\n'}Change your device's cookie settings and reload the app.`;

                    alert(msg);
                    console.error(msg);
                } else if (e.name === 'Error') {
                    const msg = `Error: ${e.message}`;

                    alert(msg);
                    console.error(msg);
                }
            }
        },

        /**
         * Restores the database to its initial state
         * @memberof AppData#
         */
        'purge' () {
            drop(this);
            this.initialize();
        },

        /**
         * Returns a logging function that confirms the success of the given database transaction
         * @callback AppData#onSuccess
         * @param {string} action - Short description of a pending transaction
         * @returns {SQLTransactionCallback} A callback that logs a success message
         */
        'onSuccess' (action) {
            return function () {
                console.info(`${action} completed.`);
            };
        },

        /**
         * Logs an error message on failure of the given database transaction
         * @callback AppData#onError
         * @param {SQLTransaction} tx - A reference to the transaction object
         * @param {SQLError} error - The error raised by <code>tx</code>
         */
        'onError' (tx, error) {
            console.error(`Transaction failed with message: ${error.message} [${error.code}]`);
        },

        /**
         * Returns a readonly reference to the underlying database
         * @type {Database}
         * @memberof AppData#
         */
        get 'db' () {
            return db;
        }
    }
}());
