var PropertyList = require('./list/property'),
	FieldList = require('./list/field'),
	Util = require('../Util');

module.exports = Class;

function Class(name)
{
	if(name == void 0)
		throw new ReferenceError('No name given for class declaration');

	this.name       =   Util.S('_'+name).camelize().s;
	this.parent     =   'cmdbAbstractObject';
	this.properties = new PropertyList(	{
		category                : 'bizmodel,searchable,structure',
		abstract                : false,
		key_type                : 'autoincrement',
		db_table                : name.toLowerCase(),
		db_key_field            : 'id',
		db_final_class_field    : 'finalclass',
		naming                  : [],
		reconciliation          : []
	});

	this.fields         =   new FieldList();
}


Class.prototype.getProperty = function(key)
{
	return this.properties.get(key);
};
Class.prototype.setProperty = function(key, value)
{
	this.properties.set(key, value);
};

Class.prototype.setField = function(key, value)
{
	this.fields.set(key, value);
};

Class.prototype.getField = function(key)
{
	return this.fields.get(key);
};