var
	Util = require('util'),
	Transformer = require('./'),
	MysqlTypes = require('mysql/lib/protocol/constants/types'),
	MysqlFlags = require('mysql/lib/protocol/constants/field_flags');



module.exports = MysqlTransformer;


function MysqlTransformer()
{
	Transformer.call(this);
}
Util.inherits(MysqlTransformer, Transformer);

MysqlTransformer.prototype.transform = function(input)
{
	var out = [];
	input.forEach(function(def){ out.push(new Class(def)); });

	return out;
};

function Class(opt)
{
	if(!opt.hasOwnProperty('name'))
		throw ReferenceError('Class definition must at least contains "name" property');

	this.name       =   opt.name;
	this.parent     =   'cmdbAbstractObject';
	this.properties = new PropertyList(	{
		category                : 'bizmodel,searchable,structure',
		abstract                : false,
		key_type                : 'autoincrement',
		db_table                : opt.name.toLowerCase(),
		db_key_field            : 'id',
		db_final_class_field    : 'finalclass',
		naming                  : [],
		reconciliation          : []
	});

	this.fields         =   new FieldList(opt.fields||[]);
}


function PropertyList(defaultProperties)
{
	this.properties = {};

	if(defaultProperties && Array.isArray(defaultProperties))
		for(var i in defaultProperties)
			this.set(i, defaultProperties[i]);
}
PropertyList.prototype.set = function(attr, val){ this.properties[attr] = val; return this; };
PropertyList.prototype.toJSON = function(){ return this.properties; };

function FieldList(fields)
{
	this.fields = [];

	var self = this;
	if(Array.isArray(fields))
	{
		fields.forEach(function(opt){ self.add(opt); });
	}
}

FieldList.prototype.add = function(opt)
{
	var field = (opt instanceof Field)?opt:new (Field.bind.call(Field, Field, opt))();
	this.fields.push(field);

	return this;
};

function Field(opt)
{
	if(!opt || !opt.hasOwnProperty('name'))
		throw ReferenceError('Field definition must at least contains "name" property');

	this.name       = opt.name;
	this.properties = new PropertyList();

	this.properties.set('sql', this.name);


}
//Field.prototype.toJson = function(){ return this.properties; };