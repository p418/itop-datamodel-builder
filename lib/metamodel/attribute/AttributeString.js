var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeString;


/**
 *
 * @todo implements AttributeString Class
 * @constructor
 */
function AttributeString()
{
	Attribute.call(this);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeString, Attribute);
