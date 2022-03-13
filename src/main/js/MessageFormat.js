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


class MessageFormat {
    static RFC_3164 = new MessageFormat('RFC_3164');
    static RFC_5424 = new MessageFormat('RFC_5424');
    static RFC_5425 = new MessageFormat('RFC_5425');

    constructor(name){
        this.name = name;
    }
    toString(){
        return `MessageFormat.${this.name}`;
    }
}

module.exports = MessageFormat;