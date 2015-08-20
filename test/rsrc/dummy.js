var Extractor = require('../../lib/extractor'),
	Transformer = require('../../lib/transformer'),
	Builder = require('../../lib/builder'),
	Util    = require('util');


module.exports = {
	Extractor   : dummyExtractor,
	Transformer : dummyTransformer,
	Builder     : dummyBuilder,
	Spy         : mkSpy
};



function mkSpy(handler)
{
	return through2.obj(function(data, encoding, next)
	{
		handler(data);
		next(null, data);
	});
}



function dummyExtractor()
{
	Extractor.call(this);

	this.extract = function(opt)
	{
		return { extracted : opt }
	}
}
Util.inherits(dummyExtractor, Extractor);


function dummyTransformer()
{
	Transformer.call(this);

}
Util.inherits(dummyTransformer, Transformer);

dummyTransformer.prototype.transform = function(data){ data.transformed = true; return data }



function dummyBuilder()
{
	Builder.call(this);
}
Util.inherits(dummyBuilder, Builder);
dummyBuilder.prototype.build = function(data)
{
	data.built = true;
	return data;
};

