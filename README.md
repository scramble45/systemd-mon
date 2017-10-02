# systemd-mon

A sophisticated wrapper for systemd's systemctl

##### Watch / Start / Stop systemd services


## Instructions for installing systemd
-----------

```sh
npm i systemd-mon
```

##### Usage:
````
var systemd = require("systemd-mon");

var daemon1 = systemd.watchDaemon('yourservicename.service');
var watch1 = daemon1.watch();

watch1.on('active', function(data){
        console.log('active', data);
});

watch1.on('inactive', function(data){
        console.log('inactive', data);
});

watch1.on('activating', function(data){
        console.log('activating', data);
});

watch1.on('deactivating', function(data){
        console.log('deactivating', data);
});

watch1.on('error', function(err){
        console.error(err);
});
````


##### Authors:
Rowan H, Shaun B, Noah B
