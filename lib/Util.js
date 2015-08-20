module.exports = (function(process)
{

	function Util()
	{
		this.process = process;
		this.currentUser = this.user = process.env.USER;

	}

	/**
	 * Merge the contents of two or more objects together into the first object.
	 *
	 * @param {object} target - An Object receiving additional properties
	 * @param {object} object1 - An object containing additional properties to merge in.
	 * @param {object} [objectN] - Additional objects containing properties to merge in.
	 */
	Util.prototype.extend = function(target, object1, objectN)
	{
		var objects = Array.prototype.slice.call(arguments, 1);

		objects.forEach(function(obj)
		{
			for(var i in obj)
			{
				if(obj.hasOwnProperty(i))
					target[i] = obj[i];

			}
		});

		return target;
	};


	/**
	 * Perform grouping on an array of objects based on properties
	 *
	 *
	 * @param {array} arr
	 * @param {function} getIndex - Function called for each item.
	 *
	 * This function should return reconciliation key to perform indexing by
	 *
	 * exemple :
	 *
	 * //unique attribute indexing key
	 * function(item)
	 * {
	 *      return item.category;
	 * }
	 *
	 * //composed indexing key
	 * function(item)
	 * {
	 *      return [item.category, item.subcategory];
	 * }
	 *
	 * @return {array}
	 */
	Util.prototype.groupBy = function(arr, getIndex)
	{
		var indexes = {},
			getIndex = getIndex ||function(item, i){ return i; };

		//indexing items
		arr.forEach(function(item)
		{
			var key = JSON.stringify(getIndex.call(null,arguments));
			(indexes[key] = indexes[key]||[]).push(item);
		});

		//returning reconcilated datas
		return Object.keys(indexes).map(function(key)
		{
			return indexes[key];
		})

	};


	/**Object.defineProperty(global, '__stack', {
		get: function() {
			var orig = Error.prepareStackTrace;
			Error.prepareStackTrace = function(_, stack) {
				return stack;
			};
			var err = new Error;
			Error.captureStackTrace(err, arguments.callee);
			var stack = err.stack;
			Error.prepareStackTrace = orig;
			return stack;
		}
	});

	Object.defineProperty(global, '__line', {
		get: function() {
			return __stack[1].getLineNumber();
		}
	});

	Object.defineProperty(global, '__function', {
		get: function() {
			return __stack[1].getFunctionName();
		}
	});**/


	Util.prototype.log = function()
	{
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function(_, stack) { return stack; };
		var err = new Error;
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;

		var fname = (stack[1].getFunctionName()||'Anonymous')+':'+(stack[1].getLineNumber());
		var args = Array.prototype.slice.call(arguments);
		args.unshift('['+fname+']');
		console.log.apply(console, args);
	};

	return new Util();

})(process);