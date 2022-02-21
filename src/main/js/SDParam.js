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

const { type } = require('os');
const util = require('util');
const internal = {};

let _paramName;
let _paramValue;



module.exports = internal.SDParam = class {

    constructor(paramName, paramValue) {
        validateParamName(paramName);
        this._paramName = paramName;
        this._paramValue = paramValue;
    }

    /**
     * 
     * @returns the value of paramName
     */
    getParamName(){
        return this._paramName;
    }

    /**
     * 
     * @returns the value of paramValue 
     */
    getParamValue(){
        return this._paramValue;
    }

    /**
     * 
     * @param {string} paramName 
     * 1*32 PRINTUSASCII; except '=', SP, ']', %d34 (")
     */
    setParamName(paramName){
        this.getParamName = paramName
    }

    /**
     * 
     * @param {*} paramValue 
     * UTF-8-STRING ; characters '"', '\' and; ']' MUST be escaped.
     */
    setParamValue(paramValue){
        this._paramValue = paramValue;

    }

    /**
     * Generate the hashcode null-safe
     * @returns hash
     */
    hashCode(){
        let hash = 7;
        hash = 59 * hash + makeHash(this._paramName);
        hash = 59 * hash + makeHash(this._paramValue);
        return hash;
    }

    equals(obj) {
        console.log(obj)
        if(util.isDeepStrictEqual(this, obj)){
            return  true;
        }
        if(obj == null){
            return false;
        }
        let sdParam = this;

        console.log((sdParam));
        console.log(type.prototype["constructor"]["name"]);
    }
}

/**
 * Private method for validate the Structure Data name 
 * @param {string} sdName 
 */
function validateParamName(sdName){
    if(sdName === null){
        throw new Error("PARAM-NAME cannot be null");
    }
    if(sdName.length > 32){
        throw new Error("PARAM-NAME must be less than 32 characters: "+sdName);
    }
    if(sdName.includes('=')){
        throw new Error("PARAM-NAME cannot contain '='");
    }
    if(sdName.includes(' ')){
        throw new Error("PARAM-NAME cannot contain SPACE aka ' '.");
    }
    if(sdName.includes(']')){
        throw new Error("PARAM-NAME cannot contain ']'");
    }
    if(sdName.includes('\"')){
        throw new Error("PARAM-NAME cannot contain '\"'");
    }

}

/**
 * 
 * @param {string} s 
 * @returns hash coded value for the s
 */
function makeHash(s){
    let h;
    for (let i = 0; i < s.length; i++){
        h = Math.imul(31, h)+ s.charCodeAt(i) | 0;
    }
    return h;
}
