const spawn = require('child_process').spawn
    , EventEmitter = require('events')
    ;

module.exports = {
    watchDaemon: createClient
    , Client
    , start
    , stop
};

function createClient(servicename, options){
    return new Client(servicename, options);
}

function Client(servicename, options){
    options = options || {};
    this.servicename = servicename;
    this.pollinterval = options.pollinterval || 500;
    this.fninterval;
}

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
