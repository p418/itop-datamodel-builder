var Util = require('../../Util'),
	Attribute = require('./AttributeSQL');


module.exports = AttributeString;


/**
 *
 * @todo implements AttributeString Class
 * @constructor
 */
function AttributeString()
{
	Attribute.apply(this, arguments);

	this.initDefaultProperties([
		['sql', this.name],
		'default_value',
		['is_null_allowed', true]
	]);

}
Util.inherits(AttributeString, Attribute);

