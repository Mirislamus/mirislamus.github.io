'use strict';
importScripts('sw-toolbox.js'); toolbox.precache(['index.html','css/main.css', 'css/vendors.min.cs', 'js/common.js', 'js/scripts.min.js']); toolbox.router.get('/img/*', toolbox.cacheFirst); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});