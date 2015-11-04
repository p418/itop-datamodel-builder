var PropertyList = require('../list/property');

module.exports = Attribute;

function Attribute(name)
{
	this.name       = name;
	this.properties = new PropertyList();
}

Attribute.prototype =
{
	getClass    : function(){ return this.constructor.name; },
	set         : function(key, value)
	{
		if(!this.properties.has(key))
			throw new ReferenceError(key+' is not an authorized property');

		this.properties.set(key, value);

		return this;
	},
	get : function(key)
	{
		return this.properties.get(key);
	},
	initDefaultProperties : function(opt)
	{
		var me = this;
		opt.forEach(function(prop, idx)
		{
			var val = null;

			if(Array.isArray(prop))
			{
				val     = prop[1];
				prop    = prop[0];
			}

			me.properties.set(prop, val);
		});

		return this;
	},
	properties  : null
};


//Attribute.prototype.toString = function(){ return this.properties.toString(); };
Attribute.prototype.toString = function(){ return this.getClass()};
Attribute.prototype.toJSON = function(){ return this.properties.toJSON(); };
