var chai = require('chai'),
	MysqlExtractor = require('../lib/extractor/mysql');

chai.should();

describe('Extractor', function()
{
	describe('Mysql', function()
	{
		var extractor = new MysqlExtractor({ database : 'sakila'});

		it('should retrieve table metadata for one table', function(next)
		{

			extractor.extract('actor')
				.then(function(statements)
				{
					statements.should.be.an('array').that.have.length(1);
					statements[0].should.have.property('fields').that.have.length(4);

					next();
				})
				.catch(function(err)
				{
					next(err);
				});
		});

	});
});