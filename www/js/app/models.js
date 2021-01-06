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
 * Encapsulates a record from the Location table
 */
class Location {

    /**
     * Initializes a new {@link Location}
     * @param {object} init - The initial values of a new {@link Location}
     * @param {number} init.locationID - The row id of a {@link Location} record
     * @param {string} init.city - The name of a city
     * @param {string} init.country - The country code of this {@link Location}
     * @param {number} init.latitude - GPS latitude of a city
     * @param {number} init.longitude - GPS longitude of a city
     */
    constructor (init = {}) {

        /** @type {number} */
        this.locationID = init.locationID;

        /** @type {string} */
        this.city = init.city;

        /** @type {string} */
        this.country = init.country;

        /** @type {number} */
        this.latitude = init.latitude;

        /** @type {number} */
        this.longitude = init.longitude;
    }
}

/**
 * Encapsulates a record from the Forecast table
 */
class Forecast {

    /**
     * Initializes a new {@link Forecast}
     * @param {object} init - The initial values of a new {@link Forecast}
     * @param {number} init.locationID - The row id of the {@link Location} associated with this {@link Forecast}
     * @param {JSON} init.data - Weather data
     * @param {Date} init.lastUpdateTime - The timestamp of the given <code>data</code>
     */
    constructor (init = {}) {

        /** @type {number} */
        this.locationID = init.locationID;

        /** @type {JSON} */
        this.data = init.data;

        /** @type {Date} */
        this.lastUpdateTime = init.lastUpdateTime;
    }
}

/**
 * Encapsulates a join query on the Forecast and Location tables
 */
class WeatherReading {

    /**
     * Initializes a new {@link WeatherReading}
     * @param {object} init - The initial values of a new {@link WeatherReading}
     * @param {string} init.city - The name of a city
     * @param {number} init.latitude - GPS latitude of a city
     * @param {number} init.longitude - GPS longitude of a city
     * @param {number} init.currency - The hour portion of the forecast timestamp (24-hr format)
     * @param {string} init.brief - A short weather description
     * @param {number} init.temp - The current recorded temperature
     * @param {number} init.low - The forecast high temperature
     * @param {number} init.high - The forecast low temperature
     * @param {number} init.windSpeed - The current recorded wind speed
     * @param {number} init.windDir - The current recorded wind direction
     * @param {number} [init.rainAmount] - The forecast rain accumulation
     * @param {number} [init.snowAmount] - The forecast snow accumulation
     * @param {boolean} init.longRange - Whether or not this {@link WeatherReading} is a long range forecast
     */
    constructor (init = {}) {

        /** @type {string} */
        this.city = init.city;

        /** @type {number} */
        this.latitude = init.latitude;

        /** @type {number} */
        this.longitude = init.longitude;

        /** @type {number} */
        this.currency = init.currency;

        /** @type {string} */
        this.brief = init.brief;

        /** @type {number} */
        this.temp = init.temp;

        /** @type {number} */
        this.low = init.low;

        /** @type {number} */
        this.high = init.high;

        /** @type {number} */
        this.windSpeed = init.windSpeed;

        /** @type {number} */
        this.windDir = init.windDir;

        /** @type {number} */
        this.rainAmount = init.rainAmount;

        /** @type {number} */
        this.snowAmount = init.snowAmount;

        /** @type {boolean} */
        this.longRange = init.longRange;
    }
}

/**
 * Encapsulates location search parameters of an API request
 */
class APIRequest {

    /**
     * Initializes a new {@link APIRequest}
     * @param {object} init - The initial values of a new {@link APIRequest}
     * @param {string} init.city - The name of a city
     * @param {number} init.latitude - GPS latitude of a city
     * @param {number} init.longitude - GPS longitude of a city
     */
    constructor (init = {}) {

        /** @type {string} */
        this.city = init.city;

        /**
         * GPS coordinates of a city
         * @property {number} latitude - GPS latitude
         * @property {number} longitude - GPS longitude
         */
        this.gps = {
            'latitude': init.latitude,
            'longitude': init.longitude
        }
    }
}

/**
 * Encapsulates display preferences
 */
class Preference {

    /**
     * Initializes a new {@link Preference}
     * @param {object} init - The initial values of a new {@link Preference}
     * @param {string} init.temp - A temperature scale; must be <code>"MET"</code> (metric) or <code>"IMP"</code> (imperial)
     * @param {string} init.wind - A wind speed scale; <code>"MET"</code> or <code>"IMP"</code>
     * @param {string} init.precip - A precipitation measurement scale; <code>"MET"</code> or <code>"IMP"</code>
     */
    constructor (init = {}) {

        /** @type {string} */
        this.preferredTempScale = init.temp;

        /** @type {string} */
        this.preferredWindScale = init.wind;

        /** @type {string} */
        this.preferredPrecipitationScale = init.precip;
    }
}
