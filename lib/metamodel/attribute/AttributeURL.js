var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeURL;


/**
 *
 * @todo implements AttributeURL Class
 * @constructor
 */
function AttributeURL()
{
	Attribute.apply(this, arguments);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeURL, Attribute);

