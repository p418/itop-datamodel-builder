var Promise = require('promise');


module.exports = Extractor;

function Extractor(conf)
{
	if(conf)
		for(var i in conf)
			this[i] = conf[i];
}

Extractor.prototype.extract = function(opt){ return opt };