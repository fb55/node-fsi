var StreamBuffer = require("streambuffer"),
    Stream = require("stream"),
    nodePath = require("path");

var FSI = module.exports = function(options){
	this.options = options;
};

FSI.prototype.writeFile = function(path, data, options, cb){
	if(this.createWriteStream === FSI.protptype.createWriteStream){
		throw Error("writeFile isn't supported!");
	}

	if(typeof options === "function"){
		cb = options;
		options = null;
	}

	var stream = this.createWriteStream(path, options);

	stream.write(data);
	stream.end();
};

FSI.prototype.createWriteStream = function(path, options){
	if(this.writeFile === FSI.protptype.writeFile){
		throw Error("createWriteStream isn't supported!");
	}

	var that = this;
	var stream = new StreamBuffer(function(e, data){
		that.writeFile(path, data, options, function(err){
			if(err) stream.emit("error", err);
		});
	});

	return stream;
};

FSI.prototype.readFile = function(path, options, cb){
	if(this.createReadStream === FSI.protptype.createReadStream){
		throw Error("readFile isn't supported!");
	}

	if(typeof options === "function"){
		cb = options;
		options = null;
	}

	this.createReadStream(path, options).pipe(
		new StreamBuffer(cb)
	);
};

FSI.prototype.createReadStream = function(path, options){
	if(this.readFile === FSI.protptype.readFile){
		throw Error("createReadStream isn't supported!");
	}

	var stream = new Stream();

	this.readFile(path, options, function(err, data){
		if(err) stream.emit("error", err);
		else {
			stream.emit("data", data);
			stream.emit("end");
		}
	});

	return stream;
};

//readdir is an alias for readDir
//FSI uses readDir as it's close to readFile etc.
FSI.prototype.readdir = function(path, options, cb){
	this.readDir(path, options, cb);
};

FSI.prototype.exists = function(path, options, cb){
	if(typeof options === "function"){
		cb = options;
		options = null;
	}

	//TODO don't use path, as it's functionality differs between plattforms
	this.readDir(nodePath.dirname(path), options, function(err, files){
		if(err) cb(err);
		else cb(null, files.indexOf(nodePath.basename(path)) >= 0);
	});
};

module.exports = FSI;