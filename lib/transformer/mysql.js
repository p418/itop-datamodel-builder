var Transformer = require('./');

module.exports = MysqlTransformer;


function MysqlTransformer()
{
	Transformer.call(this);
}
util.inherits(MysqlTransformer, Transformer);

MysqlTransformer.prototype.transform = function(input)
{

};
