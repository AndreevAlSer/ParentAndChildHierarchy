// соединение с бд 
// Здесь находится логика обращения к БД

var connection = require('./db_handler');
var mssql = require('mssql');
var path = require('path'); 

module.exports = {
    // загрузка всех элементов
			loadItems: function (req, res) {
			// подключение к бд 
			var request = new mssql.Request(connection);  

			// Вызов хранимой процедуры, чтобы достать все элементы с БД
			request.query("ParentSubs", function(err, rows) {			
				if (err) console.log(err); 
				console.log('GET ' + req.url);
				res.json(rows); 
			}); 
		},

		// загрузка элемента из бд по id 
		getItemById: function (req, res) {

			// подключение к бд 
			var ps = new mssql.PreparedStatement(connection);   
			
			var inserts = {
				companyID: parseInt(req.params.companyID)  
			} 
			
			ps.input('companyID', mssql.Int); 

			ps.prepare('EXEC Element @companyID', function(err) {
				if (err) console.log(err); 
				
				ps.execute(inserts, function(err, rows) { 
				
						if (err) console.log(err); 
					
						console.log('GET ' + req.url);
						res.json(rows['recordset'][0]);  
						ps.unprepare();  						
				}); 
			});

			
	/*		ps.prepare('SELECT * FROM ParentsAndSubsidiary WHERE companyID=@companyID', function(err) {
				if (err) console.log(err); 
				
				ps.execute(inserts, function(err, rows) { 
				
						if (err) console.log(err); 
					
						console.log('GET ' + req.url);
						res.json(rows['recordset'][0]);  
						ps.unprepare();  						
				}); 
			}); */
		},

		 // создание элемента 
		 createItem: function (req, res) 
		 {
				// подключение к бд  
				var ps = new mssql.PreparedStatement(connection);   
	
				var data = req.body;
				//var _id = Math.ceil(Math.random() * 100);

				var inserts = {
					//companyID: _id,
				//	companyID: parseInt(data.companyID),
					parentID: data.parentID,
					companyName: data.companyName, 
					companyEarning:  parseInt(data.companyEarning)
				} 

			//	ps.input('companyID', mssql.Int);
				ps.input('parentID', mssql.Int); 
				ps.input('companyName', mssql.Text); 
				ps.input('companyEarning', mssql.Int);

				ps.prepare("INSERT INTO ParentsAndSubsidiary (parentID, companyName, companyEarning) VALUES (@parentID, @companyName, @companyEarning)", function(err) 
				{
					if (err) console.log(err); 
					ps.execute(inserts, function(err, rows) 
					{
						console.log('item created');
						res.status(201).send('item created'); 
			
						ps.unprepare(); 
					}); 
				});
			},	
			
			// обновление элемента (редактирование) 
			updateItem: function (req, res) 
			{ 
				var ps = new mssql.PreparedStatement(connection);   
				
				var data = req.body;
				
				var inserts = {
					companyName: data.companyName, 
					parentID: data.parentID,
					companyEarning: data.companyEarning, 
					companyID: parseInt(data.companyID) 
				} 				
				
				ps.input('companyID', mssql.Int);
				ps.input('parentID', mssql.Int); 
				ps.input('companyName', mssql.Text); 
				ps.input('companyEarning', mssql.Int);
				
				ps.prepare('UPDATE ParentsAndSubsidiary SET companyName=@companyName, parentID=@parentID, companyEarning=@companyEarning WHERE companyID=@companyID', function(err) 
				{
						if (err) console.log(err); 
						ps.execute(inserts, function(err, rows) 
						{
								if (err) console.log(err); 

								console.log('PUT ' + req.url);
								res.status(200).send('item updated');
								ps.unprepare(); 
						}); 
				});		
			},
			// удаление элемента 
			removeItem: function (req, res) {

				var ps = new mssql.PreparedStatement(connection);   
				
				var inserts = {
					companyID: parseInt(req.params.companyID)  
				} 
				
				ps.input('companyID', mssql.Int)
								
				ps.prepare('EXEC DeleteAnyNode @companyID', function(err) 
				{
					if (err) console.log(err); 
					
					ps.execute(inserts, function(err, rows) {
						if (err) console.log(err); 
						
						console.log('DELETE ' + req.url);
										res.status(200).send('item deleted'); 
						
						ps.unprepare(); 
					}); 
				});
			}
}