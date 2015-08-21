module.exports = Attribute;

function Attribute(){};

Attribute.prototype =
{
	getType : function(){ return this.constructor.name; }
};