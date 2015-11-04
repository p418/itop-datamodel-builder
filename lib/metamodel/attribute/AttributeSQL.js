var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeSQL;


/**
 *
 * @constructor
 */
function AttributeSQL()
{
	Attribute.apply(this, arguments);
	this.primaryKey = false;

	this.initDefaultProperties([
		['sql', this.name],
		'default_value',
		['is_null_allowed', true]
	]);
}

Util.inherits(AttributeSQL, Attribute);

AttributeSQL.prototype.setPrimary = function(isPrimary)
{
	this.primaryKey = !!(isPrimary);
	return this;
};

AttributeSQL.prototype.isPrimary = function()
{
	return !!(this.primaryKey);
};



