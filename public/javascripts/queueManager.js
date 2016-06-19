/***
 * Name: Queue Manager
 * Author: Gerardo Renovales
 * Purpose: Queue request to be sent to the server
 */
 
 var _queue = [];
 var _interval = null;
 
function processQueue(){
	var _processQueue =[];
	var arrayLength = _queue.length;
	console.log(arrayLength);
	for (var i = 0; i < arrayLength; i++) {
		var item = _queue.shift();
		if(item){
			_processQueue.push(item);	
		}
		else{
			break;
		}
	}
	if(_processQueue.length > 0){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:3000/server", true);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					console.log(xhr.responseText);
					_processQueue = [];
				} else {
					console.error(xhr.statusText);
				}
			}
		};
		xhr.onerror = function (e) {
			console.error(xhr.statusText);
		};
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify(_processQueue));			
	} 
 }
 
self.addEventListener('message', function(e){
	 processMessage(e);
});
 
function processMessage(e){
	switch (e.data.cmd) {
		case 'start-queue':{
			console.log('queue started');
			_interval = setInterval(processQueue,10000);
			console.log(_interval);
			break;	
		}
		case 'stop-queue':{
			console.log('queue stoped');
			clearInterval(_interval);
			break;
		}	
		case "terminate":{
			self.close(); // Terminates the worker.
			break;
		}
		case 'add-queue':{
			console.log('add data to queue');
			_queue.push(e.data.track);
			break;					
		}
		case 'clear-queue':{
			console.log('clear queue');
			_queue =[];
			break;
		}
		default:{
			console.log('Unknown command');	
			break;
		}
	};	 
 }