'use strict';

var $fs     = require('fs'),
	$path   = require('path'),
	$hash = require('crypto').createHash('sha1');


function Connection()
{
	this.instances = {};
	this.drivers = {};
	this.loadDrivers();
}

Connection.prototype =
{
	get : function(driverName, opts)
	{
		if(!this.drivers.hasOwnProperty(driverName))
			throw 'Driver ['+driverName+'] doesnt exists';


		var id = this.hash(driverName+JSON.stringify(opts));

		if(this.instances.hasOwnProperty(id))
			return this.instances[id];
		else
			return this.instances[id] = this.drivers[driverName].createConnection(opts);
	},
	hash : function(data)
	{
		return require('crypto').createHash('sha1').update(data.toString()).digest('hex');
	},
	loadDrivers : function(path)
	{
		var path = path || __dirname,
			files = $fs.readdirSync(path);

		if(files && files.length)
		{
			files.forEach(function(file)
			{
				if(/\.js$/.test(file) && file != $path.basename(__filename))
					this.loadDriver(path+'/'+file);

			}.bind(this));
		}

		return this;
	},
	loadDriver : function(path)
	{
		var bname = $path.basename(path, '.js');
		this.drivers[bname] = require(path);

		return this;
	}
};


module.exports = new Connection();