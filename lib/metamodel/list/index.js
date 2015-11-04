module.exports = List;

/**
 * ES6's Map Emulator
 *
 * @param defaults
 * @constructor
 */
function List(defaults)
{
	this.elements   = {};
	this.size       = 0;

	if(defaults != void 0)
	{
		for(var i in defaults)
		{
			if(defaults.hasOwnProperty(i))
				this.set(i, defaults[i]);
		}
	}
}

List.prototype.clear = function()
{
	this.elements = {};
	return this;
};

List.prototype.delete = function(key)
{
	if(!this.has(key))
		return this;

	delete this.elements[key];
	this.size--;

	return this;
};

List.prototype.entries = function()
{
	var nextIndex = 0, list = this;

	return {
		next : function()
		{
			if(nextIndex>=list.size)
				return {done : true};


			var key = list.keys()[nextIndex++];
			return { value: [key, list.get(key)], done:false };

		}
	}
};


List.prototype.forEach = function(callback, thisArg)
{
	if(thisArg != void 0)
		callback.bind(thisArg);


	var it = this.entries(), item;
	while(!it.next().done)
	{
		item = it.value;
		callback(item[1], item[0], this);
	}
};

List.prototype.get = function(key)
{
	if(!this.has(key))
		return undefined;

	return this.elements[key.toString()];
};

List.prototype.set = function(key, value)
{
	if(key == void 0)
		throw new ReferenceError('key is undefined for value :'+(value));

	if(!this.has(key))
		this.size++;

	this.elements[key.toString()] = value;
	return this;
};

List.prototype.keys = function()
{
	return Object.keys(this.elements);
};



List.prototype.has = function(key)
{
	if(key == void 0)
		return false;

	return this.elements.hasOwnProperty(key.toString());
};

List.prototype.toString = List.prototype.toJSON = function()
{
	return this.elements;
};