var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeIPAddress;


/**
 *
 * @todo implements AttributeIPAddress Class
 * @constructor
 */
function AttributeIPAddress()
{
	Attribute.call(this);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeIPAddress, Attribute);
