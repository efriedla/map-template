var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var rowdy = require('rowdy-logger');
var app = express();

rowdy.begin(app);

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    db.place.findAll().then(function(places) {
        res.render('index', { places: places });
    }).catch(function(err) {
        res.send({ message: 'error', error: err });
    });
});

app.post('/places', function(req, res) {
    db.place.create({
        name: req.body.name,
        address: req.body.address
    }).then(function(place) {
        res.redirect('/');
    }).catch(function(err) {
        res.send({ message: 'error', error: err });
    });
});

var server = app.listen(process.env.PORT || 3000, function() {
    rowdy.print();
});

module.exports = server;
