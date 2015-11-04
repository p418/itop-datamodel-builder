var Util = require('../../Util'),
	Attribute = require('./AttributeSQL');


module.exports = AttributeBlob;


/**
 *
 * @todo implements AttributeBlob Class
 * @constructor
 */
function AttributeBlob()
{
	Attribute.apply(this, arguments);

	//remove following line once you implemented this class to prevent deprecation warning
	//Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(AttributeBlob, Attribute);

