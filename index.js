const spawn = require('child_process').spawn;
const EventEmitter = require('events');
const systemd_events = new EventEmitter();

systemd_events.on('error', (err) => {
  console.error(err);
});

module.exports = {
	createClient : createClient,
	Client: Client,
	start: start,
	stop: stop
}

function createClient(servicename, options){
	return new Client(servicename, options);
}

function Client(servicename, options){
	options = options ? options : {};
	this.servicename = servicename;
	this.pollinterval = options.pollinterval || 500;
	this.fninterval;
}

Client.prototype.watch = function(){
	let event = new EventEmitter();
	let curr_value = '';
	let self = this;
	function cmd(){
		let child = spawn('systemctl', ['is-active', self.servicename]);
		child.stdout.on('data', (data) => {
			data = data.toString('utf-8');
			if(curr_value !== data){
				curr_value = data;
				data = data.toString();
				data = data.replace(/(\r\n|\n|\r)/gm,'');
				event.emit(data, self.servicename);
				console.log(`getServiceCheck ${self.servicename} is: ${data}`);
			}
		});
	}
	self.fninterval = setInterval(cmd, self.pollinterval);
	return event;
}

Client.prototype.destroy = function(){
	if(this.fninterval) {
		clearInterval(this.fninterval);
	}
}


function start(servicename){
	let cmd = spawn('systemctl', ['start', servicename]);
	cmd.stdout.on('data', (data) => {
		systemd_events.emit('started', servicename);
		console.log(`started ${servicename}`);
    });
    cmd.stderr.on('data', (err) => {
    	systemd_events.emit('error', err.toString());
    	console.error(`error ${err.toString()}`);
    });
}

function stop(servicename){
	let cmd = spawn('systemctl', ['stop', servicename]);
	cmd.stdout.on('data', (data) => {
		systemd_events.emit('stopped', servicename);
		console.log(`stopped ${servicename}`);
    });
    cmd.stderr.on('data', (err) => {
    	systemd_events.emit('error', err.toString());
    	console.error(`error ${err.toString()}`);
    });
}