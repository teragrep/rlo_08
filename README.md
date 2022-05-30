![Teragrep Logo](https://avatars.githubusercontent.com/u/71876378?s=200&v=4)

# Syslog Javascript Client

## RLO_08

Client Library written in Javascript to send messages to a Syslog server

### Generate the Syslog messages

```javascript
let message = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted')
        //.withTimestamp(timestamp) // In case if the timestamp disabled, it will go with system timestamp.
        .withHostname('iris.teragrep.com')
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withProcId('8740')
        .withMsgId('ID47')
        .withMsg('Todays lucky number is 17649276') 
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) 
        .build()

```


## RLP_02 Integration & Configuration

### Install RLP_02

```cmd
npm install @teragrep/rlp_02
```


### RLP_02 RelpConnection configuration & usage

```javascript
let relpConnection = new RelpConnection();
let host = '127.0.0.1';
let port = <<SET YOUR PORT#>>;
 
 
async.waterfall(
    [
        function init(setConnect) {
            setConnect(null, port, host)
        },
        connect,
        load,
        commit,
        disconnect
 
    ],
    function (err) {
        if(err) {
            console.log(err);
        }
        else {
            console.log('No Error')
        }
    }
)
async function connect() {
    let conn = await relpConnection.connect(cfePort, host);
    return conn;
}
 
async function disconnect(state) {
if(state){
     await relpConnection.disconnect();
}
else {
    console.log('Check the connection...')
  }
}
```

