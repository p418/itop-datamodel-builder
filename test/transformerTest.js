var chai = require('chai'),
	MysqlTransformer = require('../lib/transformer/mysql');
chai.should();


describe('Transformer', function()
{

	describe('Mysql', function()
	{
		var actorScheme = require('./rsrc/actor.json');

		it('should transform mysql def json well', function()
		{
			var transformer = new MysqlTransformer();
			var transformed = transformer.transform(actorScheme);

			console.log(JSON.stringify(transformed, null, ' '))
		});

	});


});


