/**
 * This is an experimental version, could be adapated later.
 *  
 * Relp Output component RLO_08  
 * Copyright (C) 2021, 2022  Suomen Kanuuna Oy
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.  
 */

/**
 * @todo:
 * 1 - Generics - NA
 * 2 - Timeunit - Done
 * 3 - Lock and flow control on the node env - TBD
 *  This class similar embracement of the Java's CachingReference idea
 */

'use strict'

/**
 * As Node is single-threaded, the asynchronous nature of its execution model allows for 
 * race conditions that require similar synchronization primitives.
 * Mutex solves the synchrnizing async operations 
 */
const { Mutex } = require('async-mutex'); 
const TimeUnit = require('../lib/TimeUnit');
const os = require('os');

let _reentrantReadWriteLock;
let _lastCreationInNanos;
let _timeToLiveInNanos;
let _object;

/**
 *  Should it be an abstract class??? 
 *  
 */
 class CachingReference {
 
    /**
     * 
     * @param {number} timeToLive 
     * @param {TimeUnit} timeToLiveUnit // This can accept valid time unit from nanoseconds to days. Ref: lib/TimeUnit.js 
     * Acceptable timeToLiveUnit are: nanoseconds, microseconds, milliseconds, seconds, minutes, hours, days.
     * @todo: Enchancment 
     */
    constructor(timeToLive, timeToLiveUnit){
        let tunit = timeToLiveUnit;
        tunit = checkTimeUnit(tunit);
        console.log(tunit);
        this._timeToLiveInNanos = TimeUnit.nanoseconds.convert(timeToLive, TimeUnit.days);
        console.log(TimeUnit.nanoseconds.convert(timeToLive, tunit));
        console.log(this._timeToLiveInNanos);
    }

    /**
     * @todo This is kind of  abstract method signature, to be implemented in the concrete class
     *  however, any impacts on this implementation????
     */
    newObject(){
        try {
            return os.hostname();
        } catch(e){
            let NILVALUE = new String('-');
            return NILVALUE.valueOf();    
        }
        // As abstract method, derived class must implement 
        //throw new Error('Derived class need to implement the method !');
    } 
    /**
     * Why need locking on single threaded NodeJS, in case
     * Lock flow. Async nature, RWL - 
     * @Option 1 using Async Mutex
     * @Option 2 Using the readwrite-lock  // 
     * Nanoseconds precision using BigInt
     */
    async get(){

        //TODO: Does it fulfill the locking strategy???
        const release = await Mutex.acquire();
        try {

            // get the precise nanoseconds timestamp using node process module and casted to Number type to avoid 
            // TypeError: cannot mix BigInt and other types 
            if((Number(process.hrtime.bigint()) - this._lastCreationInNanos) > this._timeToLiveInNanos) {
                // @js-check as this is a single threaded, still fair enough thread safe???
                this._object = this.newObject();
            }

        } finally {
            release();
        }       
    }

    toString(){
        return "CachingReference["+ this._object+ "]";
    }



}
module.exports = CachingReference;

/**
 * Performance Issue
 * 
 * @param {TimeUnit} timeToLiveUnit 
 * @returns TimeUnit.<type>
 */
 function checkTimeUnit(timeToLiveUnit){
    let timeUnit = Object.keys(TimeUnit); // Check the validity of the TimeUnit except clearTimeOut and clearInterval
    for (let value of timeUnit) {
        if(value != 'clearTimeout' && value != 'clearInterval'){
            if(value == timeToLiveUnit)
            switch(value){
                case 'nanoseconds': 
                    return TimeUnit.nanoseconds;
                case 'microseconds':
                    return TimeUnit.microseconds;
                case 'milliseconds':
                    return TimeUnit.milliseconds;
                case 'seconds': 
                    return TimeUnit.seconds;
                case 'minutes':
                    return TimeUnit.minutes;
                case 'hours':
                    return TimeUnit.hours;
                case 'days':
                    return TimeUnit.days;
            }
        }
        else {
            throw new Error('Invalid Time unit');
        }
    }
 }


