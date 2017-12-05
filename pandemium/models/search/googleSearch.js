var https = require('https');

var apiKey = 'AIzaSyAC81m_sAt5er7pEWV8iftPZL40YvONc7Es';
var customSearch = '014213754068618715256:oyi0ols3czy';
var numberOfResult = 15;
var count=0;
var error=false;

function search(query, callback) {
	var defaultPath = '/customsearch/v1?key='+apiKey+'&cx='+customSearch+'&q='+query;
	var options = {
		host: 'www.googleapis.com',
		path: defaultPath
	};

	var body = [];
	var request;
	
	for(var i=0; i<=numberOfResult;i+=10){
		options.path=defaultPath+'&start='+(i+1)+'&num='+Math.min(10,numberOfResult-i);
		request = https.get(options, function(res) {
			console.log(res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			// Buffer the body entirely for processing as a whole.
			var bodyChunks = [];
			res.on('data', function(chunk) {
				// You can process streamed parts here...
				bodyChunks.push(chunk);
				console.log("[REQ]Chunks : "+bodyChunks.length);
			}).on('end', function() {
				body.push(Buffer.concat(bodyChunks));
				finalCallback(body, callback);
				//console.log('BODY: ' + body);
				// ...and/or process the entire body here.
			});
					
		});
	}

	request.on('error', function(e) {
		error=true;
		console.log('ERROR' + e.message);
	});

}

function finalCallback(body, callback){
	count+=10;
	if(body.length>(numberOfResult-1)/10){
		var data = {};
		data.items = [];
		for(var i = 0; i<body.length; i++){
			var items = JSON.parse(body[i].toString()).items;
			if(items != null){
				data.items = data.items.concat(items);
			}
		}
		console.log(data.items.length+" results obtained");
		if(data.items.length==0){
			error=true;
			console.log('ERROR : no results obtained');
		}else{
			callback(data);
		}
		finalCallback = function(){
				console.log('ERROR : multiple callback');
			};
	}
}

module.exports.search = search;
