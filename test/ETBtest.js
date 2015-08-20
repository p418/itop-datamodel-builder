var ETB = require('../lib/ETB'),
	chai = require('chai'),
	Extractor = require('../lib/extractor'),
	Dummy = require('./rsrc/dummy'),
	fs = require('fs');



describe('ETB', function()
{
	describe('Init', function()
	{
		it('should init handler according expected type', function()
		{
			var ext = new Extractor();
			ETB.setExtractor(ext);
			chai.expect(ETB.extractor).to.be.instanceOf(Extractor);
		});

		it('should permit sub class handler', function()
		{
			var ext = new Dummy.Extractor();
			ETB.setExtractor(ext);
			chai.expect(ETB.extractor).to.be.instanceOf(Dummy.Extractor);
		});

		it('should instantiate handler dynamically', function()
		{
			ETB.setExtractor('mysql', {});
			chai.expect(ETB.extractor.constructor.name).to.be.equal('MysqlExtractor');
		});

	});

	describe('workflow', function()
	{
		it('should process dummy sync workflow', function(next)
		{
			var spy = Dummy.Spy(function(data, enc, cb)
			{
				chai.expect(data).to.deep.equal({ extracted : "dummy", transformed : true, built : true });
				next();
			});

			ETB.setExtractor(new Dummy.Extractor())
				.setTransformer(new Dummy.Transformer())
				.setBuilder(new Dummy.Builder())
				.from('dummy')
				.pipe(spy);
		});

		it('should process async workflow', function(next)
		{

			//this test is based on sakila sample database
			//http://dev.mysql.com/doc/sakila/en/sakila-installation.html

			var MysqlExtractor = require('../lib/extractor/mysql');
			var spy = Dummy.Spy(function(data, enc, cb)
			{
				chai.expect(data).to.have.any.keys('transformed', 'built');
				next();
			});

			ETB.setExtractor(new MysqlExtractor({ database : 'sakila'}))
				.setTransformer(new Dummy.Transformer())
				.setBuilder(new Dummy.Builder())
				.from(['actor'])
				.pipe(spy);
		});


	});

});