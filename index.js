const spawn = require('child_process').spawn
    , EventEmitter = require('events')
    ;

module.exports = {
    watchDaemon: createClient
    , Client
    , start
    , stop
    , restart
};

function createClient(servicename, options){
    return new Client(servicename, options);
}

function Client(servicename, options){
    options = options || {};
    this.servicename = servicename;
    this.pollinterval = options.pollinterval || 200;
    this.fninterval;
}

// Watch a service based on status using systemctl
Client.prototype.watch = function (){
    let event = new EventEmitter()
        , curr_value = ''
        , self = this
        ;
    function cmd(){
        let child = spawn('systemctl', ['is-active', self.servicename]);
        child.stdout.on('data', (data) => {
            data = data.toString('utf-8');
            if(curr_value !== data){
                curr_value = data;
                data = data.toString();
                data = data.replace(/(\r\n|\n|\r)/gm, '');
                event.emit(data, self.servicename);
            }
        });
    }
    this.fninterval = setInterval(cmd, this.pollinterval);
    return event;
};

// Monitor a services output using journalctl
Client.prototype.monitor = function (){
    let event = new EventEmitter()
        , curr_value = ''
        , self = this
        ;
        let child = spawn('journalctl', ['-u', self.servicename, '-f', '--output=cat', '--lines=1']);
        child.stdout.on('data', (data) => {
            data = data.toString('utf-8');
            if(curr_value !== data){
                curr_value = data;
                data = data.toString();
                data = data.replace(/(\r\n|\n|\r)/gm, '');
                event.emit(self.servicename, data);
            }
        });
    return event;
};


Client.prototype.destroy = function (){
    if(this.fninterval){
        clearInterval(this.fninterval);
    }
};


function start(servicename){
    let cmd = spawn('systemctl', ['start', servicename]);
    cmd.stdout.on('data', () => {
        console.log(`started ${servicename}`);
    });
    cmd.stderr.on('data', (err) => {
        console.error(`error ${err.toString()}`);
    });
}

function stop(servicename){
    let cmd = spawn('systemctl', ['stop', servicename]);
    cmd.stdout.on('data', () => {
        console.log(`stopped ${servicename}`);
    });
    cmd.stderr.on('data', (err) => {
        console.error(`error ${err.toString()}`);
    });
}

function restart(servicename){
    let cmd = spawn('systemctl', ['restart', servicename]);
    cmd.stdout.on('data', () => {
        console.log(`restarted ${servicename}`);
    });
    cmd.stderr.on('data', (err) => {
        console.error(`error ${err.toString()}`);
    });
}