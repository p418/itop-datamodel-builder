var Util = require('../../Util'),
	List = require('../list'),
	Property = require('../Property');

module.exports = PropertyList;


function PropertyList(defaultProperties)
{
	List.call(this);

	if(defaultProperties != void 0)
	{
		for(var i in defaultProperties)
			this.set(i, defaultProperties[i]);
	}

}



PropertyList.prototype.set = function(key, value)
{
	this.super_.set.call(this, key, new Property(key, value));
};


Util.inherits(PropertyList, List);
