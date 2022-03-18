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

const { HashSet } = require("dsa.js");
const CachingReference = require("../../util/CachingReference");
const { RFC_3164, RFC_5424, RFC_5425 } = require("./MessageFormat");
const MessageFormat = require("./MessageFormat");


let _facility;
let _severity;
let _timestamp;
let _hostname;
let _appName;
let _procId;
let _msgId;
let _sdElements; //Set datastructure
let _msg; //charArrayWriter

/**
 * @todo enhance the implementation with Builder design pattern
 * 
 */
class SyslogMessage {

    static SP = ' ';
    static NILVALUE = '-';
    static DEFAULT_CONCURRENCY = 50;
    static rfc3339DateFormat;
    static rfc3164DateFormat;
    /**
     * @todo 
     * 1 - Create the cachingReference similar with java implementation
     * 2 - concurrency???
     * 
     */
    static localhostNameReference = this.cachingReferenceInit();  // Need to  get the local host name
    static concurrncy; // Need to set the concurrency, rfc3339, rfc3164 DateFormat

    
    static cachingReferenceInit(){
        this.localhostNameReference = new CachingReference(10, "seconds");
        this.localhostNameReference.newObject();
    }


    getFacility(){
        return this._facility;
    }

    setFacility(facility){
        this._facility = facility;
    }

    withFacility(facility){
        this._facility = facility;
        return this;
    }

    getSeverity(){
        return this._severity;
    }

    setSeverity(severity){
        this._severity = severity;
    }

    withSeverity(severity){
        this._severity = severity;
        return this;
    }

    /**
     * @todo
     */
    getTimestamp(){
        
    }

    setTimestamp(timestamp){
        this._timestamp = timestamp;
    }

    /**
     * @todo
     * @param {*} timestamp 
     */
    withTimestamp(timestamp){

        this._timestamp = (timestamp == null ? null: time); // TODO
        return this;
    }

    getHostname(){
        return this._hostname;
    }

    setHostname(hostname){
        this._hostname = hostname;
    }

    withHostname(hostname){
        this._hostname = hostname;
        return this;
    }

    getAppName(){
        return _appName;
    }

    getPorcId(){
        return this._procId
    }

    setProcId(procId){
        this._procId = procId;
        return this;
    }

    getMsg(){
        return this._msg;
    }

    setMsg(msg){
        this._msg = msg;
    }

    /**
     * @todo investigate for the need of simila java implementation of the charArrayWriter vs final String 
     * @param {*} msg 
     * @returns 
     */
    withMsg(msg){
        this._msg = msg;
        return this;
    }

    getSDElements(){
        let ssde = this._sdElements;
        if(ssde == null){
            ssde = new HashSet(); // TODO
        }
        return ssde;
    }

    setSDElements(ssde){
        this._sdElements = ssde; // TODO
    }

    withSDElement(sde){
        if(this._sdElements == null){
            this._sdElements = new HashSet();
        }
        this._sdElements.add(sde) //TODO
        return this;
    }

    toSyslogMessage(messageFormat){
        if(messageFormat instanceof MessageFormat) {
            switch(messageFormat) {
                case RFC_3164:
                    break; //TODO: Fututre implementation
                case RFC_5424:
                    return toRfc5424SyslogMessage();
                case RFC_5425:
                    break; // TODO: Future implementation
                default:
                    throw new Error("Unsupported Message Format "+ messageFormat );
            }
        }
    }

    /**
     * 
     */
    toRfc5424SyslogMessage(){

    }













    








}

