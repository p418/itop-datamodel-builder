var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = AttributeHierarchicalKey;


/**
 *
 * @todo implements AttributeHierarchicalKey Class
 * @constructor
 */
function AttributeHierarchicalKey()
{
	Attribute.call(this);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeHierarchicalKey, Attribute);
