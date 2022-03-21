const CachingReference = require('../../util/CachingReference');
const fetchHost = require('../../util/FetchHost');


 const simpleCache = new CachingReference(fetchHost);

 setTimeout(simpleCache.getData, 0);
 setTimeout(simpleCache.getData, 1000)
 setTimeout(simpleCache.getData, 12000)
 setTimeout(simpleCache.getData, 4000)
 setTimeout(simpleCache.getData, 6000)