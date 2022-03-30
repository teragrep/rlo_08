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

'use strict'

const os = require('os');

class CachingReference {

    constructor(fetchHost, timeToLive = 10){

        this.timeToLiveInMillis = timeToLive * 1000; // Milli or Nano???
        this.fetchHost = fetchHost;
        this.cache = null;
        this.getData = this.getData.bind(this);
        this.resetCache = this.resetCache.bind(this);
        this.isCacheExpired = this.isCacheExpired.bind(this);
        this.fetchDate = new Date(0);
       // console.log(this.timeToLiveInMillis);

    }
    isCacheExpired() {
        //console.log(this.fetchDate.getTime() + this.timeToLiveInMillis)
        return (this.fetchDate.getTime() + this.timeToLiveInMillis < new Date())
    }

    async getData() {
        if(!this.cache || this.isCacheExpired()){
            //console.log('Expired - Fetching the hostname')
            return this.fetchHost()
                .then((data) => {
                    //console.log(data, new Date())
                    this.cache = data;
                    this.fetchDate = new Date();
                    return Promise.resolve(this.cache); // TODO: Check for the flaw ☢️
                 });
        } 
        else {
          //  console.log('From Cache '+this.cache)
            return Promise.resolve(this.cache);
        }
    }

    resetCache(){
        this.fetchDate = new Date(0);
    }
}

module.exports = CachingReference;