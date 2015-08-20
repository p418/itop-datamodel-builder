var Connection = require('../connection'),
	Promise = require('promise'),
	Extractor = require('../extractor'),
	$util     = require('util'),
	Util      = require('../Util'),
	From = require('from2');
	through2 = require('through2');
	//spigot = require('stream-spigot');


module.exports = MysqlExtractor;

function MysqlExtractor(conf)
{
	Extractor.call(this);

	this.conf =
	{
		host                : 'localhost',
		user                : Util.currentUser,
		multipleStatements  : true
	};

	if(conf)
		Util.extend(this.conf, conf);

	this.connection = Connection.get('mysql', this.conf);
}

$util.inherits(MysqlExtractor, Extractor);

/**
 * Retrieve metadatas for one or more database table
 *
 * @param {string|array} table(s) to retrieve meta from
 * @type {Promise}
 */
MysqlExtractor.prototype.extract = MysqlExtractor.prototype.get = function(tables)
{
	if(typeof tables == 'string')
		var tables = [tables];
	else
		if(Array.isArray(tables))
			var tables = tables;
		else
			throw new TypeError("received '"+typeof(tables)+"', required type string or Array ");


	var self = this;

	return new Promise(function(resolve, reject)
	{
		self.query(tables)
			.then(function(statements)
			{

				var metas = [];
				statements.forEach(function(statement, idx)
				{
					//console.log(statement);
					metas.push
					({
						name    : statement.getColumnMeta(0).table,
						fields  : statement.getAllColumnMeta()
					});
				});

				resolve(metas);

			})
			.catch(reject)
	});
};


/**
 *
 * Encapsulate tables metadata into a stream
 *
 * @see  MysqlExtractor.get
 * @param tables
 * @returns {*}
 */
MysqlExtractor.prototype.stream = function(tables)
{
	var self = this;
	var stream =  From({objectMode : true},function(size, next)
	{
		self.get(tables)
			.then(function (metas)
			{
				stream.push(metas);
				stream.emit('end');
			})
			.catch(function (err)
			{
				 next(err);
			});
	});

	return stream;
};

$util.deprecate(MysqlExtractor.prototype.stream, 'MysqlExtractor.stream: Unstable method')


MysqlExtractor.prototype.query = function(tables)
{
	var self = this, sql = tables.map(this.getSQL);
	return this.connection.query(sql.join('; '));

};


MysqlExtractor.prototype.getSQL = function(tablename)
{
	return 'SELECT * FROM '+tablename+' limit 1';
};