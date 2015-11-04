module.exports = Property;

function Property(name, value)
{
	this.name = name;
	this.value = value;
}

Property.prototype.toString = Property.prototype.toJSON = function()
{
	return this.value;
};