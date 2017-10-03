const systemd = require('systemd-mon');

const serviceName = process.argv[ 2 ];
if(!serviceName){
    console.error('Service Name not provided.');
    process.exit(1);
}

const daemon1 = systemd.watchDaemon(serviceName);


const watch1 = daemon1.watch();
const monitor1 = daemon1.monitor();

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

monitor1.on(serviceName, (data) => {
    console.log('Monitored Sevice:', data);
});

monitor1.on('error', err => {
    console.error(err);
});

