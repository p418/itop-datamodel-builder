var $mysql = require('mysql'),
	$promise = require('promise'),
	$types = require('mysql/lib/protocol/constants/types'),
	$flags = require('mysql/lib/protocol/constants/field_flags'),
	Util = require('../Util');


function Mysql()
{
	this.driver     = $mysql;
	this.connection = null;
}



Mysql.prototype = {

	autoConnect   : false,
	autoClose     : false,
	createConnection : function(opt)
	{
		//opt.debug = true;
		if(this.connection = this.driver.createConnection(opt))
		{
			if(this.autoConnect)
				this.connection.connect();
		}

		return this;
	},
	query : function(sql)
	{
		var self = this, args = Array.prototype.slice.call(arguments);

		return new $promise(function(resolve, reject)
		{
			args.push(function(error, results, fields)
			{
				if(error)
				{
					//console.log(error);
					reject(error);
				}
				else
				{

					var statement = [];

					if(Array.isArray(results[0])) //are we facing multiple statements?
					{
						results.forEach(function(result, idx)
						{
							statement.push(new MysqlResult(error, result, fields[idx]));
						});
					}
					else
					{
						statement.push(new MysqlResult(error, results, fields));
					}

					resolve(statement);
				}

				if(self.autoClose)
					self.end();
			});


			self.connection.query.apply(self.connection, args);

		});

	},
	end : function()
	{
		if(this.connection)
			return this.connection.end();
	}

};
module.exports = new Mysql();



function MysqlResult(error, results, fields)
{
	this._error      = error;
	this._results    = results;
	this._fields     = fields;

	this.cursor         = 0;
	this._rowCount      = this._results?this._results.length:0;
	this._columnCount   = this._fields?this._fields.length:0;
}


MysqlResult.prototype =
{
	errorInfo   : function(){ return this._error; },
	errorCode   : function(){ return this._error.sqlState; },

	rowCount    : function(){ return this._rowCount; },

	fetchAll    : function() { return this._results;},
	fetch       : function()
	{
		if(this.cursor < this._rowCount)
			return this._results[this.cursor++];
		return null;
	},

	getColumnCount : function(){ return this._columnCount;},
	getColumnMeta : function(idx)
	{
		var meta = null;
		if(meta =  this._fields[idx]||null)
		{
			meta.typeStr = this._getTypeString(meta.type);
			meta.flagsStr = this._getFlagsString(meta.flags);
		}
		return meta;
	},
	getAllColumnMeta : function()
	{
		var metas = [];
		var i = 0;

		while(i < this.getColumnCount())
		{
			metas.push(this.getColumnMeta(i++));
		}

		return metas;

	},
	_getTypeString : function(val)
	{
		for(var i in $types)
			if($types[i] == val)
				return i;
		return '';
	},
	_getFlagsString : function(val)
	{
		var flags = [];
		for(var i in $flags)
		{
			if($flags[i]&val)
				flags.push(i);
		}
		return flags;
	}
};