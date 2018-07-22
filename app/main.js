//  серверный веб-фреймворк
var express = require('express');
var app = express();  

var http = require('http'); 
var path = require('path'); 

/* BodyParser обрабатывает тела application/json запросов и выставляет для них req.body. */
var bodyParser = require('body-parser'); 

app.use(bodyParser.json()); 

// Приложение
var port = 8081; 

// api доступа к БД
var portApi = 8080;

// Тут создается web-сервер,
// «слушающий» порт 8081 и обрабатывающий запрос к /, ответом на который выводится представление в index.html.
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html')); 
}); 

// response - данные от сервера
// res - обьект ответа от сервера

var cb = function (response, res) {
    // на событие 'data' установлена функция, которая принимает порцию данных и записывает в ответ
    response.on('data', function (chunk) {
       
        res.write(chunk.toString());
    });

    response.on('end', function () {
        res.end();
    })
};

// На маршрут выполняется функция - обработчик
// Показать все элементы
app.get('/all', function (req, res) {

    var options = {
        host: 'localhost', 
        port: portApi, 
        method: 'GET', 
        path: '/api/'
    } 

    var request = http.request(options, function (response) {
        cb(response)
    }); 
    request.end(); 
}); 

// Показать 1 элемент
app.get('/view/:companyID', function (req, res) {

    var options = {
       host: 'localhost',
       port: portApi, 
       method: 'GET',
       path: '/api/' + req.params.companyID
   }

    var request = http.request(options, function (response) {
        cb(response)
    });
    request.end(); 
}); 

// Добавление данных
app.post('/new', function (req, res) {

    // данные для запроса на сервер
    var options = {
       host: 'localhost',
       port: portApi, 
       method: 'POST',
       path: '/api/new' ,
       // Отправка данных в json формате
       headers: {
           'Content-Type': 'application/json'
       }
   }
    // Запрос на сервер
    var request = http.request(options, function (response) {
        cb(response)
    });
    
    // Получаем данные с сервера, сериализуем их и отправляем пользователю в качестве ответа
    request.write(JSON.stringify(req.body));
    request.end();     
}); 

// Обновление данных
app.post('/edit/:companyID', function (req, res) {

    // конфигурируем обьект для запроса на сервер
    var options = {
       host: 'localhost',
       port: portApi, 
       method: 'PUT',
       path: '/api/' + req.params.companyID, 
       headers: {
           'Content-Type': 'application/json'
       }
   }

    var request = http.request(options, function (response) {
        cb(response)
    }); 
    console.log('POST BODY:', req.body);
    request.write(JSON.stringify(req.body));
    request.end();     
});

// Удаление элемента
app.get('/delete/:companyID', function (req, res) {

    var options = {
       host: 'localhost',
       port: 1337, 
       method: 'DELETE', 
       path: '/api/' + req.params.companyID
   }

    var request = http.request(options, function (response) {
        cb(response, res)
    });
    request.end(); 
});

app.listen(port, function() {
   
   console.log('app running on port ' + port); 
})
