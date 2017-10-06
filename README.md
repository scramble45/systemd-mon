# systemd-mon

A sophisticated wrapper for systemd's systemctl/journalctl

##### Start / Stop / Restart / Watch / Monitor systemd services


## Instructions for installing systemd
-----------

```sh
npm i systemd-mon
```

##### Usage:
````
const systemd = require("systemd-mon");

const daemon1 = systemd.watchDaemon('yourservicename.service');
const watch1 = daemon1.watch();
const monitor1 = daemon1.monitor();

watch1.on('active', data => {
        console.log('active', data);
});

watch1.on('inactive', data => {
        console.log('inactive', data);
});

watch1.on('activating', data => {
        console.log('activating', data);
});

watch1.on('deactivating', data => {
        console.log('deactivating', data);
});

watch1.on('error', err => {
        console.error(err);
});

monitor1.on(serviceName, (data) => {
    console.log('Monitored Sevice:', data);
});

monitor1.on('error', err => {
	console.error(err);
});

/* Start / Stop / Restart - Service */
systemd.start('yoursevicename');
systemd.stop('yoursevicename');
systemd.restart('yoursevicename');

````


##### Authors:
Rowan H, Shaun B, Noah B
