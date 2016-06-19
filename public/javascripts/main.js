var _heatmapInstance = null;
var _sessionGUID = null;
var _container = document.getElementById("container");
var _worker;

function toggleHeatmap(){
	
}

function init(){
	_sessionGUID = generateUUID();
	
	document.getElementById('uuid').innerText = _sessionGUID
	
	if(_container){
		_heatmapInstance = h337.create({
			container: _container,
			radius: 90
		});		
		if(_heatmapInstance){
						
			if(typeof(Worker) !== "undefined") {
				if(typeof(_worker) == "undefined"){
					_worker = new Worker("/javascripts/queueManager.js");
				}
				
				if(_worker){
					_worker.postMessage({'cmd': 'start-queue'});
				}		
			}

			_container.onmousemove = function(ev){
				if(_worker){
					_worker.postMessage({
							'cmd': 'add-queue', 'track':{
							sessionID: _sessionGUID,
							x: ev.layerX,
							y: ev.layerY,
							value: 1
						}
					});
				}					
			}
		}		
	}
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

init();