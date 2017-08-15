var SerialPort = require("serialport");
var buffer2 = Buffer.from("B0C0A80101001A", "hex")

var port = new SerialPort("/dev/ttyUSB0",{
    bandrate:9600,
    autoOpen:false,
    stopBits:1,
timeOut:2
});

function writeCmd(){
	console.log('in writeCmd()');
	port.write(buffer2);
}

port.open(function (err) {
	if (err) {
		return console.log('Error opening port: ', err.message);
	}
	setInterval(writeCmd,2000);
 
});


port.on('open', function() {
	console.log('in open');
});

port.on('data', function (data) {
	console.log('Data:', data.toString('hex'));
});
