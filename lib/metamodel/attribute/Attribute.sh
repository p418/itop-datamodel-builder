
for f in $(find . -regextype egrep -regex './Attribute[A-Z]+.js');
do
classname=$(basename $f .js)
(cat <<TPL
var Util = require('../../Util'),
	Attribute = require('./Attribute');


module.exports = %CLASSNAME%;


/**
 *
 * @todo implements %CLASSNAME% Class
 * @constructor
 */
function %CLASSNAME%()
{
	Attribute.apply(this, arguments);

	//remove following line once you implemented this class to prevent deprecation warning
	Util.log('Deprecated: This class isnt implemented. You are using Attribute class instead')
}

Util.inherits(%CLASSNAME%, Attribute);

TPL
)| sed -e "s/%CLASSNAME%/${classname}/" > "$f"
done