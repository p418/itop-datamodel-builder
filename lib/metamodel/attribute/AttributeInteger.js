var Util = require('../../Util'),
	Attribute = require('./AttributeSQL');


module.exports = AttributeInteger;


/**
 *
 * @todo implements AttributeInteger Class
 * @constructor
 */
function AttributeInteger()
{
	Attribute.apply(this, arguments);

}

Util.inherits(AttributeInteger, Attribute);

