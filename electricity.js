var SerialPort = require("serialport");
var config = require('./config');
var readCmd1 = Buffer.from("B0C0A80101001A", "hex")
var dataBuffer = new Array();
var port = new SerialPort("/dev/ttyUSB0",{
	bandrate : config.serialBandrate,
	autoOpen : false,
	stopBits : config.serialStopBits,
	timeOut : config.serialTimeOut
});


function writeDC2DB(dc1,dc2){
	console.log(dc1);
	console.log(dc2);
}

function readDC(data, cmd){
	//only one item in data(array) for new hardware
	for(x in data){
		console.log('Data:---', data[x]);
	}

	var index = data.toString().indexOf(cmd);
	if(index !== -1){
		console.log("====================includes cmd at : " + index);
		var dc1 = parseInt(data.toString().substring(4,6),16);	
		var dc2 = parseInt(data.toString().substring(6,8),16);	
		writeDC2DB(dc1, dc2);
	}else{
		console.log("no a0 index found!");
	}
}

//checkData's Sum
function checkData(data){
	if(data.toString().length>=14){
		var dataStr = data.toString();
		var sum = 0;
		for(var i=0;i<12;i=i+2){
			console.log(dataStr.substring(i,i+2));
			sum = sum + parseInt(dataStr.substring(i,i+2),16);
		}
		console.log("sum is : " + sum.toString(16));
		var sumHexInt = sum & 0xff;
		console.log("sumHexInt is : " + sumHexInt.toString(16));
		if(dataStr.substring(12,14) == sumHexInt.toString(16)){
			return true;
		}
	}
	return false;
}

function writeCmd(cmd){
	console.log('in writeCmd()');
	if(checkData(dataBuffer)){
		readDC(dataBuffer, cmd);
	}else{
		console.log("receive data error:" + dataBuffer);
	}
	dataBuffer.length = 0;
	port.write(readCmd1);
}

port.open(function (err) {
	if (err) {
		return console.log('Error opening port: ', err.message);
	}
	setInterval(writeCmd, 2000, config.readDCCmd); 
});


port.on('open', function() {
	console.log('in open');
});

port.on('data', function (data) {
//	console.log('Data:', data.toString('hex'));
	dataBuffer.push(data.toString('hex'));
});

