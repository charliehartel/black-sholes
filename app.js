
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var Np = function(x) {
	return (1/Math.sqrt(2*Math.PI))*(Math.exp(-Math.pow(x,2)/2));
};

var N = function(x) {
	var y = 0.2316419,
		a1 = 0.319381530,
		a2 = -0.356563782,
		a3 = 1.781477937,
		a4 = -1.821255978,
		a5 = 1.330274429;
		k = 1/(1+y*x);

	if (x >= 0) {
		return 1 - Np(x)*(a1*k + a2*Math.pow(k,2) + a3*Math.pow(k*3) + a4*Math.pow(k,4) + a5*Math.pow(k,5));
	} else {
		return 1-N(-x);
	}
};

var d1 = function(S, iv, yield, t, rate) {
	return (Math.log(1) + (rate - yield + Math.pow(iv,2))*t)/(iv*Math.sqrt(t));
};

var d2 = function(S, iv, yield, t, rate) {
	return d1(S, iv, yield, t, rate) - iv*Math.sqrt(t); 
};

var Vcall = function(S, iv, yield, t, rate) {
	return Math.exp(Math.pow(-rate*t))*S*N(d1(S, iv, yield, rate)) - Math.exp(-rate*t)*S*N(d2(S,iv,yield,t,rate));
};

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
