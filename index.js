var ETB = require('./lib/ETB'),
	Connection = require('./lib/connection');


var mysql = Connection.get('mysql', { database : 'sakila' , user : 'dngo'});

mysql.autoClose = true;
mysql.query('select rating, special_features from film limit 1')
	.then(function(statements)
	{
		console.log(statements[0].fetchAll());
	})
	.catch(console.log);



