var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeEnum;


/**
 *
 * @todo implements AttributeEnum Class
 * @constructor
 */
function AttributeEnum()
{
	Attribute.call(this);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeEnum, Attribute);