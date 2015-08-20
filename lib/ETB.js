var Stream = require('from2'),
	Throught2 = require('through2'),
	Extractor = require('./extractor'),
	Transformer = require('./transformer'),
	Builder = require('./builder'),
	Promise = require('promise'),
	Util = require('./Util');



module.exports = ETB =
{
	debug       : false,

	extractor   : null,
	transformer : null,
	builder     : null,

	setExtractor    : function(extractor, opt) { return set.call(this, 'extractor', Extractor, extractor, opt); },
	setTransformer  : function(transformer, opt) { return set.call(this,'transformer', Transformer, transformer, opt); },
	setBuilder      : function(builder, opt) { return set.call(this, 'builder', Builder, builder, opt); }
};
ETB.log = function()
{
	if(this.debug)
	{
		Util.log.apply(null, arguments);
	}

	return this;
};

ETB.from = function(opt)
{
	init();

	var self = this;
	return begin(opt)
			.pipe(this.transform())
			.pipe(this.build());
};






/**
 Privates function

**/
var begin = (function begin(opt)
{
	var out = this.extractor.extract(opt);

	ETB.log('Data extracted');

	if(out instanceof Promise)
	{
		ETB.log('type: Promise');

		var stream =  Stream({objectMode : true},function(size, next)
		{
			out.then(function (metas)
			{
				stream.push(metas);
				stream.emit('end');
			})
			.catch(function (err)
			{
				next(err);
			});
		});
	}
	else
	{
		ETB.log('type: Sync');
		var stream  = Stream.obj([out]);

	}

	return stream;
}).bind(ETB);





var init = (function init()
{
	this.log('initialize extract engine');
	initExtractor.call(this);

	this.log('initialize transform engine');
	initTransformer.call(this);

	this.log('initialize build engine');
	initBuilder.call(this);

	return this;

}).bind(ETB);


function streamer(handler)
{
	return Throught2.ctor({ objectMode : true }, function(data, enc, next)
	{
		next(null, handler(data));
	});
}

function initExtractor()
{
	if(this.extractor == null || !('extract' in this.extractor))
		throw new ReferenceError('extractor not set or does not implement extract() method');

	return this;
}

function initTransformer()
{
	if(this.transformer == null)
	{
		this.log('No transformer provided, fallback to original one');
		this.transformer = new (require('./transformer'));
	}
	else
	if(!('transform' in this.transformer))
		throw new ReferenceError('defined transformer does not implement transform() method');

	this.transform = streamer(this.transformer.transform);

	return this;
}


function initBuilder()
{
	if(this.builder == null)
	{
		this.log('No builder provided, fallback to original one');
		this.builder = new (require('./transformer'));
	}
	else
	if(!('build' in this.builder))
		throw new ReferenceError('defined builder does not implement build() method');

	this.build = streamer(this.builder.build);

	return this;
}


function set(target, expected, obj, opt )
{
	if(obj instanceof expected)
		this[target] = obj;
	else if((typeof obj == "string") && (typeof opt == "object"))
	{
		var constructor = require(__dirname+'/'+target+'/'+obj);
		this[target] = new constructor(opt);
	}
	else
		throw new TypeError('Invalid extractor type');

	return this;
};