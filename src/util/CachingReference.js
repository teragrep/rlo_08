/**
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
 * 1 - Generics - 
 * 2 - Timeunit - Done
 * 3 - Lock and flow control on the node env
 *  This class similar embracement of the Java's CachingReference idea
 */

'use strict'

const TimeUnit = require('../lib/TimeUnit');

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
     * Acceptable timeToLiveUnit are: nanoseconds, microseconds, milliseconds, seconds, minutes, hours, days
     */
    constructor(timeToLive, timeToLiveUnit){
        let tunit = timeToLiveUnit;
        tunit = checkTimeUnit(tunit);
        console.log(tunit);
        this._timeToLiveInNanos = TimeUnit.nanoseconds.convert(timeToLive, TimeUnit.days);
        console.log(TimeUnit.nanoseconds.convert(timeToLive, tunit));
        console.log(this._timeToLiveInNanos);
    }



}
module.exports = CachingReference;

/**
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


