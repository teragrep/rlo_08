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

const SDParam = require("./SDParam");

 const internals = {};
 let _sdID;
 let _sdParams = [];
 let _unmodifiableList = ['timeQuality', 'origin','meta'];
 let _RESERVED_SDID;
 
 class SDElement {
     constructor(sdID, ...sdParams){
         this._RESERVED_SDID = Array.from(_unmodifiableList); // This ensures the field is not undefined
        
         if(arguments.length === 1){
             validateSDID(sdID, this._RESERVED_SDID); // Pass the SDID to the private validate method, due to accessor concern
             this._sdID = sdID;
         }
         else {
             validateSDID(sdID. this._RESERVED_SDID);
             this._sdID = sdID;
             this._sdParams = [...sdParams];
         }        
     }
 
     /**
      * 
      * @returns sdID
      */
     getSdID(){
         return this._sdID;
     }
 
     getSdParams(){
         return this._sdParams;
     }
 
     /**
      * 
      * @param {*} sdParams 
      */
     setSdParams(sdParams){
         if(sdParams == null || sdParams == undefined){
             throw new Error("sdParams cannot be null");
         }
         this._sdParams = [...sdParams]; // copy the array
     }

     /**
      * 
      * @param {string} paramName 
      * @param {string} paramValue 
      * @returns SDParam
      */
     addSDParam(paramName, paramValue){
         return addSDSingleParam(new SDParam(paramName, paramValue));
     }

     /**
      * 
      * @param {*} sdParam 
      * @returns 
      */
     addSDSingleParam(sdParam){
         this._sdParams.push(sdParam);
         return this;
     }


     /**
     * Check: Generate the null-safe hashcode, Does it fulfill??
     * @returns hash
     */
    hashCode(){
        let hash = 7;
        hash = 97 * hash + makeHash(this._sdID);
        return hash;
    }

    /**
     * 
     * @param {*} obj 
     * @returns 
     */
    equals(obj) {
        console.log(obj)

        if(util.isDeepStrictEqual(this, obj)){
            return  true;
        }
        if(obj == null){
            return false;
        }
        
        if (!(obj.getClass() == "SDElement")){
            return false;
        }
    }

    /**
     * @todo constructor overloading conflicts 
     * @returns 
     */
    getClass(){
        console.log(this.constructor.name);
        return this.constructor.name;
    }
 }
  
 
 module.exports = SDElement;

/**
 * @todo 
 * @comment send the sdName,RESERVED_SDID as an object
 * @param {*} sdName 
 * @param {*} RESERVED_SDID 
 */
 function validateSDID(sdName, RESERVED_SDID){

    /**
     * @todo still could not access the private scope propery, 
     * 
     */
    Object.defineProperty(SDElement,'_RESERVED_SDID', {
        get(){
            return _RESERVED_SDID;
        }
    });

     //let sdName = new String(sdNameParam); // Ensure the string content
     console.log('From validateSDID '+sdName + ' '+ RESERVED_SDID)
     
     if(sdName == null){
         throw new Error("SD-ID cannot be null")
     }
     if(sdName.length > 32){
         throw new Error("SD-ID must be less than 32 characters: "+sdName);
     }
     if(sdName.includes('=')){
        throw new Error("PARAM-NAME cannot contain '='");
    }
     if(sdName.includes(' ')){
         throw new Error("SD-ID cannot contain ' '");
     }
     if(sdName.includes(']')){
         throw new Error("SD-ID cannot contain ']'");
     }
     if(sdName.includes('\"')){
        throw new Error("PARAM-NAME cannot contain '\"'");
    }
    if(!(sdName.includes('@'))){
        let found = false;           
        for(let value of Object.values(RESERVED_SDID)){
            console.log(value);
            if(value === sdName){
                found = true;
                console.log('Breaking......') //Test
                break;
             }
        }
        if(! found){
            console.log('not found');//test
            throw new Error("SD-ID is not known registered SDID: "+ sdName);
        }
    }
  
 }

 /**
 * 
 * @param {string} str 
 * @returns hash coded value for the s
 */
function makeHash(str){
    let hash;
    for (let i = 0; i < str.length; i++){
        hash = Math.imul(31, hash)+ str.charCodeAt(i) | 0;
    }
    return hash;
}