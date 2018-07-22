// Подключаем модуль mssql для работы с mssql сервером
var mssql = require('mssql'); 

var config = {
    user: 'sasha',  // пользователь базы данных
    password: '123', // пароль пользователя
    server: 'localhost', // хост
    database: 'ParentAndChilds', // имя бд
    pool: {
        max: 10, 						// максимальное допустимое количество соединений пула 
        min: 0,  						// минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 		// время ожидания перед завершением неиспользуемого соединения 
    }
};


var connection = new mssql.ConnectionPool(config); 
var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 