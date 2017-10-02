const systemd = require('systemd-mon');

const serviceName = process.argv[ 2 ];
if(!serviceName){
    console.error('Service Name not provided.');
    process.exit(1);
}

var daemon1 = systemd.watchDaemon(serviceName);

var watch1 = daemon1.watch();

watch1.on('active', (data) => {
    console.log('active', data);
});

watch1.on('inactive', (data) => {
    console.log('inactive', data);
});

watch1.on('activating', (data) => {
    console.log('activating', data);
});

watch1.on('deactivating', (data) => {
    console.log('deactivating', data);
});

watch1.on('error', (err) => {
    console.error(err);
});

let count = 0;
setInterval(() => {
    count += 1;
    if(!count % 2 === 0){
        systemd.start(serviceName);
    } else{
        systemd.stop(serviceName);
    }
}, 15 * 1000);
