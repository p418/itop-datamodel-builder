var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeEmailAddress;


/**
 *
 * @todo implements AttributeEmailAddress Class
 * @constructor
 */
function AttributeEmailAddress()
{
	Attribute.call(this);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeEmailAddress, Attribute);
