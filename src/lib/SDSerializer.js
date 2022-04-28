const SDParam = require('../main/js/SDParam')

class SDSerializer {

    constructor( sdp, buffer, pos){
        this.sdp = sdp;
        this.buffer = buffer;
        this.pos = pos;
    }
    getBuffer(){
        return this.buffer;
    }

    getPosition(){
        return this.pos;
    }

    getSdp(){
        return this.sdp;
    }

    setPosition(pos){
        this.pos = pos;
    }

}
module.exports = SDSerializer;