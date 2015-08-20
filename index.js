var Extractor = require('./lib/extractor/mysql'), through2 = require('through2'), fs = require('fs');

var extractor = new Extractor({ database : 'datacenter' , user : 'advim', password : 'advim'});

/**extractor
	.stream(['sd_category', 'sd_entity'])
	.pipe(through2.obj(function (chunk, enc, cb)
	{
		cb(null, chunk)
	}))
	.pipe(fs.createWriteStream('test.json'));
**/
