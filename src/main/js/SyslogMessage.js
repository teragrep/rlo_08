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
const FetchHost = require('../../util/FetchHost');
const RFC3339DateFormat = require("../../util/RFC3339DateFormat");


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
 * @todo enhance the implementation with Builder design pattern, handling writeSDElement, paramvalue...
 * 
 */
class SyslogMessage {

    static SP = ' ';
    static NILVALUE = '-';
    static DEFAULT_CONCURRENCY = 50; // TODO: NA this time, TBD
    static rfc3339DateFormat = RFC3339DateFormat;
    static rfc3164DateFormat;
    /**
     * @todo 
     * 1 - Create the cachingReference similar with java implementation // Drop this feature
     * set method HostName 
     * OverEngineered, wrap the necessary params
     * 2 - concurrency???
     * 
     */
    static localhostNameReference = new CachingReference(FetchHost);  //  get the host name and refresh every 10
    static concurrncy; // Need to set the concurrency, rfc3339, rfc3164 DateFormat

    
    
    /*
    * According to <a href="http://tools.ietf.org/html/rfc3164#section-4.1.2">RFC31614- 4.1.2 HEADER Part of a syslog Packet</a>,
    * we should use local time and not GMT.
    * <quote>
    *     The TIMESTAMP field is the local time and is in the format of "Mmm dd hh:mm:ss" (without the quote marks)
    * </quote>
    */



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
     * @returns the Date object created using the timestamp (milliseconds)
     */
    getTimestamp(){
        return this_timestamp == null ? null : new Date(this._timestamp);
        
    }

    /**
     * @param {Date} 
     */
    setTimestamp(timestamp){
        if(timestamp instanceof Date){
            this._timestamp = timestamp == null ? null : timestamp.getTime();
        }
    }

    /**
     * @todo
     * @param {Number} timestamp 
     */
    withTimestamp(timestamp){

        if(isNaN(timestamp)){
            throw new Error('Not a Number. Unsupported Format');
        }
        else {
            this._timestamp = timestamp;
            return this;
        }
    }

    /**
     * 
     * @param {Date} timestamp 
     */
    withDateTimeStamp(timestamp){

        if(timestamp instanceof Date){
            this._timestamp = timestamp == null ? null : timestamp.getTime();
        }
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
     * 
     * Generates an <a href="http://tools.ietf.org/html/rfc5424">RFC-5424</
     * ,a> message.
     * 
     * 
     */
    toRfc5424SyslogMessage(){

        let stringWriter = Buffer.alloc(this._msg == null ? 32 : this._msg.size() + 32);
        try {
            this.toRfc5424SyslogMessagewithWriter(stringWriter);
        }
        catch(err){
            throw new Error()

        }
        return stringWriter; // Lets return the buffer, so we can adjust the content 

    }

    /**
     * 
     * @param {Buffer} out  
     * uses UTF-8 by default. 
     * Keep in mind that some characters may occupy more than one byte in the buffer like é
     * @todo possible enhancement
     */
    async toRfc5424SyslogMessagewithWriter(out) {
        
        let offset = 0; // Marker to locate the position to write
        let pri = this._facility.getNumericalCode() * 8 + this._severity.getNumericalCode();
        out.write('<', offset++); // write the 1st char and move the marker to the next writeable location
        out.write(pri.toString(), offset);
        offset += pri.toString().length; // Move the marker after number of chars in the PRI value
        out.write('>', offset++);
        out.write('1', offset++); // Version
        out.write(this.SP, offset++);
        //TODO: Replace the RFC3339DateFormat
        let rfc3339timeStamp = (this._timestamp == null ? rfc3339DateFormat(new Date()) : rfc3339DateFormat(new Date(this._timestamp)));
        out.write(rfc3339timeStamp, offset);
        offset += rfc3339timeStamp.toString().length;
        out.write(this.SP, offset++);
        // set the hostname
        this._hostname == null ? await this.localhostNameReference.getData() : this._hostname; // 
        out.write(this._hostname, offset);
        offset += this._hostname.length;
        out.write(this.SP, offset++);
        //appname
        let appTemp = this.writeNilableValue(this._appName, out, offset);
        offset = appTemp.offset;
        out.write(this.SP, offset++);
        //PID
        let proTemp = this.writeNilableValue(this._procId, out, offset);
        offset = proTemp.offset;
        out.write(this.SP, offset++);
        //msgID
        let msgTemp = this.writeNilableValue(this._msgId, out, offset);
        offset = msgTemp.offset;
        out.write(this.SP, offset++);
        //write SD
        writeStructureDataOrNillableValue(sdElements, out);

    }

    /**
     * @todo transform to private method
     * @param {string} value 
     * @param {Buffer} out 
     * @param {Number} offset 
     * @returns {Buffer, Number}
     */
    writeNilableValue(value, out, offset){
        if(value == null){
            out.write(this.NILVALUE, offset);
            offset++;
            return {out: out, offset: offset};
        }
        else {
            out.write(value, offset);
            offset += value.length;
            return {out, offset};
        }
    }

    /**
     * 
     * @param {*} sdElements 
     * @param {*} out 
     */
     writeStructureDataOrNillableValue(sdElement, out){
         if(sdElement == null || sdElement.isEmpty()){
             
         }

     }

     /**
      * 
      * @param {*} sdElement 
      * @param {*} out 
      */
     writeSDElement(sdElement, out){

     }
     
     /**
      * 
      * @param {*} sdParam 
      * @param {*} out 
      */
     writeSDParam(sdParam, out){

     }

     /**
      * 
      * @param {*} paramValue 
      */
     getEscapedParamValue(paramValue){

     }
    





}
module.exports = SyslogMessage;
    

