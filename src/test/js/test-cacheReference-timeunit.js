const CachingReference = require('../../util/CachingReference');
const fetchHost = require('../../util/FetchHost');


 const simpleCache = new CachingReference(fetchHost, 10);
 const getHost =  async() => {
    let hostname = await simpleCache.getData();
    console.log(hostname);
    return hostname;
    
    /*
     await simpleCache.getData().then((result) => {
        hostname = result;
        console.log('HOSTNAME ',result);
    })
   */   
}
getHost();

/*
 setTimeout(simpleCache.getData, 0);
 setTimeout(simpleCache.getData, 1000)
 setTimeout(simpleCache.getData, 12000)
 setTimeout(simpleCache.getData, 4000)
 setTimeout(simpleCache.getData, 6000)
 */