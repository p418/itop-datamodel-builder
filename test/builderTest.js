var chai = require('chai'),
	XMLBuilder = require('../lib/builder/xml');


chai.should();

describe('Builder', function()
{

	var actorMeta = require('./rsrc/actor.transformed.json');
	describe('XML', function()
	{
		it('should build XML datamodel from json', function()
		{
			var builder = new XMLBuilder();

			console.log(builder.build([actorMeta]));
		});

	});


});


