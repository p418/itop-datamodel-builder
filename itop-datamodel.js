#!/usr/bin/env node


var path = require('path'),
	pkg = require(path.join(__dirname, 'package.json')),
	app = require('commander'),
	fs = require('fs'),
	prompt = require('readline-sync'),
	chalk = require('chalk'),
	S = require('string'),
	through2 = require('through2'),
	vinylFS = require('vinyl-fs');


app.version(pkg.version)
	.usage('<database> [options] --from table1,table2')
	.option('-H, --host <host>', 'Database hostname (default: localhost)', trim, 'localhost')
	.option('-u, --user [username]', 'Database username (default:current user)', trim)
	.option('-p, --password [password]', 'Database password', trim)
	.option('-f, --from <tables>', 'comma-separated list of tables to extract', readTables)
	.option('-s, --source <source>', 'Specify extractor type (default: mysql)', 'mysql')
	.option('-f, --flavor [flavor]', 'Specify output file format (default: xml)', 'xml')
	.option('-t, --to [directory]', 'Specify generated directory path (default: current dir)', resolvePath, resolvePath('datamodel'))
	.option('-v, --verbose', 'verbose workflow', false)
	.parse(process.argv)
;



switch(true)
{
	case (app.args.length != 1 ): exit('Please specify database');break;
	case (app.from == undefined): exit('--from option not specified'); break;
}

var connectionOpt = { database: app.args[0], host : app.host };

var summary = {
	"Database"  : connectionOpt.database,
	"Host"      : connectionOpt.host,
	"Tables"    : chalk.bold(app.from.length)+' table(s)'
};


//read database username
var user;
if(user = (function(username)
{
	if(username == undefined)
		return null;

	if(username === true)
		return prompt.question('Username:').trim();

	return username;

})(app.user))
	connectionOpt['user'] = user;

summary['User'] = user?user:chalk.grey.italic('No provided');


//read database password
var password;
if(password = (function(password)
{
	if(password == undefined)
		return null;

	if(password === true)
		return prompt.question('Password:', {hideEchoBack : true}).trim();

	return password
})(app.password))
	connectionOpt['password'] = password;

summary['Password'] = password?'YES':'NO';



summary['Output format'] = app.flavor;
summary['Output folder'] = app.to;


//Let's begin
try
{

	if(!confirm(summary))
	{
		console.log('Bye!');
		process.exit(0);
	}



	var Extractor   = require('./lib/extractor/'+app.source);
	var Transformer = require('./lib/transformer/'+app.source);
	var Builder = require('./lib/builder/'+app.flavor);

	var ETB = require('./lib/ETB');
	ETB.debug = app.verbose;


	//Workflow init
	ETB
		.setExtractor(new Extractor(connectionOpt))
		.setTransformer(new Transformer())
		.setBuilder(new Builder());

	var c = 0;
	ETB
		.from(app.from)
		.pipe(through2.obj(function(data, enc, next)
		{
			console.log(chalk.white.bold(data.length)+' table(s) extracted');
			next(null, data);
		}))
		.bundle()
		.pipe(vinylFS.dest(app.to),  {end : true})
		.on('finish', function()
		{
			console.log(chalk.green.bold('Finished!'));
			process.exit(0);
		});


}
catch(e)
{
	console.log(chalk.bgRed.white.bold(e.message));
}


/**
 *  Some functions
 *
 */


function readTables(tables)
{
	return tables.split(',');
}

function parseBool(val)
{
	return !!(val);
}

function resolvePath(aPath)
{
	return path.resolve(process.cwd(), aPath);
}

function trim(str)
{
	return str.trim();
}


function exit(message)
{
	app.outputHelp(function(help)
	{
		console.log(chalk.bgRed.bold.white(message),help);
		process.exit();
	})
}

function confirm(summary)
{

	var confirm = '\n'+chalk.white.bold.underline('Summary')+'\n';

	for(var text in summary)
		confirm += '\n'+chalk.green.bold(S(text).padRight(15).s)+chalk.white(summary[text]);

	return prompt.keyInYNStrict(confirm+'\n\n Do you confirm generation?')
}