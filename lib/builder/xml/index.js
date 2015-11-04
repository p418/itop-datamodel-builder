var Jade = require('jade'),
	Util = require('../../Util'),
	Builder = require('../'),
	File = require('vinyl');


module.exports = XMLBuilder;


function XMLBuilder()
{
	Builder.apply(this, arguments);
}

Util.inherits(XMLBuilder, Builder);
XMLBuilder.prototype.objectMode = false;

XMLBuilder.prototype.compile = Jade.compileFile(__dirname+'/datamodel.jade', {pretty : true});

XMLBuilder.prototype.build = function(defs)
{
	var me = this,
		files = [], file, fileName,
		contents;


		defs.forEach(function (def) {

			fileName = 'datamodel.' + def.name + '.xml';
			contents = me.compile({cls: def});
			var file = new File({
				path: './'+fileName,
				contents: new Buffer(contents)
			});

			this.push(file);

		}, files);

	return files;
};




