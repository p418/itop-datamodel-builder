var
	Util = require('util'),
	Transformer = require('./'),
	MysqlTypes = require('mysql/lib/protocol/constants/types'),
	MysqlFlags = require('mysql/lib/protocol/constants/field_flags'),
	Class = require('../metamodel/Class'),
	AttributeSQL = require('../metamodel/attribute/AttributeSQL');





module.exports = MysqlTransformer;

function MysqlTransformer()
{
	Transformer.apply(this, arguments);
	this.self = this;
}
Util.inherits(MysqlTransformer, Transformer);

MysqlTransformer.prototype.transform = function(input)
{
	var out = [], me = this, cls, attr;

	//itop forbidden field
	//var ignoreField = ['id', 'priority', 'status', 'description', 'data', 'notes', 'name', 'section', 'category_id',
	var ignoreField = ['id'];

	input.forEach(function(def)
	{
		cls = new Class(def.name);
		def.fields.forEach(function(field)
		{
			//check if we are dealing a reserved field
			if(ignoreField.indexOf(field.name) != -1)
				return;

			attr = me.attributeFactory(field);
			cls.setField(attr.name, attr);

			if(attr instanceof AttributeSQL)
			{
				if(attr.isPrimary())
						cls.setProperty('db_key_field', attr.name);
			}
		});
		out.push(cls);
	});

	return out;
};


MysqlTransformer.prototype.requireAttribute = function(className)
{
	return require('../metamodel/attribute/'+className);
};


MysqlTransformer.prototype.attributeFactory = function(def)
{
	var obj;
	switch(def.typeStr)
	{
		case 'NEWDECIMAL':
		case 'SHORT':
		case 'LONG':
		case 'TINY':
		case 'YEAR':
		case 'INT24':
			obj = new (this.requireAttribute('AttributeInteger'))(def.name);
		break;
		case 'FLOAT':
			obj = new (this.requireAttribute('AttributeDecimal'))(def.name);
		break;
		case 'DATE':
		case 'NEWDATE':
			obj = new (this.requireAttribute('AttributeDate'))(def.name);
		break;
		case 'TIMESTAMP':
		case 'DATETIME':
			obj = new (this.requireAttribute('AttributeDateTime'))(def.name);
		case 'VAR_STRING'   :
		case 'VARCHAR'      :
		case 'STRING'       :
			obj = new (this.requireAttribute('AttributeString'))(def.name);
			break;
		case 'BLOB':
			obj = new (this.requireAttribute('AttributeText'))(def.name);
			break;
		default:
			var className = "Attribute"+(Util.S(def.typeStr).capitalize().s);
			try
			{
				obj = new (this.requireAttribute(className));
				console.log(def.typeStr+' automatically converted to '+className);
			}
			catch(e)
			{
				//console.log(def);
				throw new Error('Cannot convert '+def.typeStr+' to attribute type \n'+ e.message);
			}
	}

	if(obj instanceof AttributeSQL)
	{
		obj.setPrimary(def.flags&MysqlFlags.PRI_KEY_FLAG);
		obj.set('is_null_allowed', !!(def.flags&MysqlFlags.NOT_NULL_FLAG));
	}

	return obj;
};
