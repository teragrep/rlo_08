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

const util = require('util');

let _paramName;
let _paramValue;



 class SDParam {

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
        return Buffer.from(this._paramValue, 'utf-8').toString();
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
        this._paramValue = Buffer.from(paramValue, 'utf-8');

    }

    /**
     * Check: Generate the null-safe hashcode, Does it fulfill??
     * @returns hash
     */
    hashCode(){
        let hash = 7;
        hash = 59 * hash + makeHash(this._paramName);
        hash = 59 * hash + makeHash(this._paramValue);
        return hash;
    }

    /**
     * @todo investigate: Does it need all the validity check similar to java implementation
     * However need to improve these methods.
     * @param {SDParam} obj 
     * @returns 
     */
    equals(obj) {
        
        if(util.isDeepStrictEqual(this, obj)){
            return  true;
        }
        if(obj == null){
            return false;
        }
        
        if (!(obj.getClass() == "SDParam")){
            return false;
        }
    }

    getClass(){
        console.log(this.constructor.name);
        return this.constructor.name;
    }

    toString(){
        return 'SDParam{' + 'paramName=' + this._paramName + ', paramValue='+ this._paramValue + '}';
    }
}
module.exports = SDParam;

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
    let hash;
    for (let i = 0; i < s.length; i++){
        hash = Math.imul(31, hash)+ s.charCodeAt(i) | 0;
    }
    return hash;
}

function checkEquality(obj){
    console.log(obj.constructor.name);
}