var Stream = require('from2'),
	Through2 = require('through2'),
	Extractor = require('./extractor'),
	Transformer = require('./transformer'),
	Builder = require('./builder'),
	Promise = require('promise'),
	Util = require('./Util'),
	Vinyl = require('vinyl');
	VinylFS = require('vinyl-fs');



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
	this.stream = begin(opt)
			.pipe(this.transform())
			.pipe(this.build());

	return this;
};

ETB.pipe = function()
{
	this.stream.pipe.apply(this.stream, arguments);
	return this;
};

ETB.bundle = function()
{
	if(this.stream == void 0)
		throw new ReferenceError('Stream not found. Try calling .from() first');

	var mainStream = this.stream,
		stream = Stream.obj(function(size, cb)
		{
			mainStream.on('data', function(files)
			{
				files.forEach(function(file)
				{
					stream.push(file);
				});
				cb(null, null);
			})
			.on('end', function()
			{
				stream.emit('end')
			})
		});

	return stream;
};




ETB.to = ETB.dest = function(dir)
{
	if(this.stream == void 0)
		throw new ReferenceError('Stream not found. Try calling .from() first');

	this.stream.pipe(through2.obj(function(data, enc, next)
	{
		if(Vinyl.isVinyl(data))
			data = [data];

		if(Array.isArray(data))
		{
			Stream.obj(function(size, cb)
			{
				data.forEach(function(file)
				{
					if(!Vinyl.isVinyl(file))
						return;

					this.push(file);

				}, this);
				//this.emit('end');
				cb(null, null);

			})
			.pipe(VinylFS.dest(dir));
			/*.pipe(Through2.obj(function(data, enc, cb)
				{
					cb(null,null);
				}))*/
		}

		next(null, data);
	}));

	return this.stream;
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


/**
 * Initialize ETB engine
 *
 * @private
 */
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

/**
 * Wrap a function/handler into a stream
 *
 * @param handler
 * @param thisArg this binding
 * @returns {*}
 */
function streamer(handler)
{
	return Through2.ctor({ objectMode :true }, function(data, enc, next)
	{
		var output = handler(data);
		next(null, output);
	});
}

/**
 * initalize Extractor
 *
 * @returns {initExtractor}
 */
function initExtractor()
{
	if(this.extractor == null || !('extract' in this.extractor))
		throw new ReferenceError('extractor not set or does not implement extract() method');

	return this;
}

/**
 * Initialize transformer
 *
 * @returns {initTransformer}
 */
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

	this.transform = streamer(this.transformer.transform.bind(this.transformer));

	return this;
}

/**
 * initialize Builder
 *
 * @returns {initBuilder}
 */
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

	this.build = streamer(this.builder.build.bind(this.builder));

	return this;
}


/**
 *
 * @param target attribute name to be assigned
 * @param expected expected typed object/instance
 * @param obj object to assign to attribute
 * @param opt parameters to be passed to potential constructor
 * @returns {set}
 */
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
}