var ETB = require('../lib/ETB'),
	chai = require('chai'),
	Extractor = require('../lib/extractor'),
	MysqlExtractor = require('../lib/extractor/mysql'),
	Dummy = require('./rsrc/dummy'),
	fs = require('fs'),
	vinylFS = require('vinyl-fs'),
	gulp = require('gulp');



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

	describe('dummy workflow', function()
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

	describe('real mysql to XML workflow', function(next)
	{
		this.timeout(30000);
		it('should process real data', function(next)
		{
			var MysqlTransformer = require('../lib/transformer/mysql'),
				XMLBuilder = require('../lib/builder/xml');

			var spy = Dummy.Spy(function(data, enc, cb)
			{
				console.log(data);
				next(null, data);
			});

			ETB.setExtractor(new MysqlExtractor({ database : 'sakila'}))
				.setTransformer(new MysqlTransformer())
				.setBuilder(new XMLBuilder());

			var tables = "actor,actor_info,address,category,city,country,customer,customer_list,film,film_actor,film_category,film_list,film_text,inventory,language,nicer_but_slower_film_list,payment,rental,sales_by_film_category,sales_by_store,staff,staff_list,store".split(',');
			var count = tables.length-1;
			ETB.from(tables)
				.bundle()
				.pipe(vinylFS.dest(__dirname+'/build'))
				.on('data', function(file)
				{
					console.log(file.basename);
					--count || next();
				});



		});
	});
});