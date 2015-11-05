var chai = require('chai'),
	MysqlTransformer = require('../lib/transformer/mysql'),
	Class = require('../lib/metamodel/Class'),
	AttributeInteger = require('../lib/metamodel/attribute/AttributeInteger');
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

			chai.expect(transformed).to.be.an('array').with.length(1);

			var first = transformed[0];
			chai.expect(first).to.be.an.instanceOf(Class);
			chai.expect(first).to.have.any.keys('name', 'parent', 'properties', 'fields');

			first.fields.keys().should.contains('actor_id', 'first_name', 'last_name', 'last_update' );

			first.getField('actor_id').should.be.instanceOf(AttributeInteger);

			//console.log(JSON.stringify(first))		;
		});

	});


});


