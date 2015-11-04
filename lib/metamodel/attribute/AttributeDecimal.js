var Util = require('../../Util'),
	Attribute = require('./AttributeSQL');


module.exports = AttributeDecimal;


/**
 *
 * @todo implements AttributeDecimal Class
 * @constructor
 */
function AttributeDecimal()
{
	Attribute.apply(this, arguments);

	this.initDefaultProperties([
		['digits', 6],
		['decimal', 2]
	]);
}

Util.inherits(AttributeDecimal, Attribute);
