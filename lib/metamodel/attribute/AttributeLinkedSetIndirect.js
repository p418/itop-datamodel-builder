var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeLinkedSetIndirect;


/**
 *
 * @todo implements AttributeLinkedSetIndirect Class
 * @constructor
 */
function AttributeLinkedSetIndirect()
{
	Attribute.apply(this, arguments);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeLinkedSetIndirect, Attribute);

