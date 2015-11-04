var Util    = require('../../Util'),
	List    = require('../list');


module.exports = FieldList;

function FieldList(fields)
{
	List.apply(this, arguments);
}


Util.inherits(FieldList, List);
