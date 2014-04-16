moment = require('moment');

function Np(x) {
	var val = (1/Math.sqrt(2*Math.PI))*(Math.exp(-Math.pow(x,2)/2));
	//console.log('Np = ' + val + ' with x=' + x);
	return val;
};

function N(x) {
	var y = 0.2316419,
		a1 = 0.319381530,
		a2 = -0.356563782,
		a3 = 1.781477937,
		a4 = -1.821255978,
		a5 = 1.330274429,
		k = 1/(1+y*x),
		val;

	//console.log('k = ' + k);
	if (x >= 0) {
		val = 1 - (a1*k + a2*Math.pow(k,2) + a3*Math.pow(k,3) + a4*Math.pow(k,4) + a5*Math.pow(k,5))*Np(x);
	} else if (x < 0) {
		val = 1-N(-x);
	} else {
		throw "x is undefined";
	}

	//console.log('N = ' + val + ' with x=' + x);
	return val;
};

function d1(S, X, iv, yield, t, rate) {
	var val = (Math.log(S/X) + (rate - yield + Math.pow(iv,2))*t)/(iv*Math.sqrt(t));
	//console.log('d1 = ' + val);
	return val;
};

function d2(S, X, iv, yield, t, rate) {
	var val = d1(S, X, iv, yield, t, rate) - iv*Math.sqrt(t); 
	//console.log('d2 = ' + val);
	return val;
};

BlackSholes = function() {

};

BlackSholes.Vcall_europe = function(S, X, iv, yield, t, rate) {
	var tau = t/365;
	return Math.exp(-yield*tau)*S*N(d1(S, X, iv, yield, tau, rate)) - Math.exp(-rate*t)*X*N(d2(S, X, iv, yield, tau, rate));
};

BlackSholes.impliedVolatility = function(S, X, P, yield, t, rate) {
	var matrix = [],
		epsilon = .00001,
		delta = .001,
		error;

	matrix.push({iv0: 0.20, iv1: undefined, error: undefined});
	do {
		var iv0, iv1, Pt;

		iv0 = matrix[matrix.length-1].iv0;
		Pt = BlackSholes.Vcall_europe(S, X, iv0, yield, t, rate);
		var dPtd = (BlackSholes.Vcall_europe(S, X, iv0 - delta, yield, t, rate) - Pt)/delta;  //calculate derivative.
		iv1 = iv0 - (P - Pt)/(dPtd);
		error = (iv0 - iv1)/iv1;

		matrix[matrix.length-1].iv1 = iv1;
		matrix[matrix.length-1].error = error;
		matrix[matrix.length-1].Pt = Pt;
		matrix.push({iv0: iv1, iv1: undefined, error: undefined});

	} while (Math.abs(error) > epsilon)
	console.log(matrix);

	return matrix[matrix.length-1].iv0; 
};

module.exports = BlackSholes;

var duration = moment("Jan 17, 2015");
console.log(duration.days);

function AAPL() {
	var i;
	var strike = 500;
	var expiration = moment(new Date(2014, 3, 18));
	console.log("AAPL");
	for (i = 0; i < 20; i++) {
		console.log(strike + i*5 + ' - $' + BlackSholes.Vcall_europe(515.20, strike + i*5, .15234, 0.0, expiration.diff(moment(), 'days'), 0.0));
	}

	console.log(BlackSholes.impliedVolatility(515.20, 500, 15.2947, 0, expiration.diff(moment(), 'days'), 0));
}

function PCLN() {
	var i;
	var strike = 500;
	var expiration = moment(new Date(2015, 0, 16));

	console.log("PCLN");
	strike = 1000;
	for (i = 0; i < 80; i++) {
		console.log(strike + i*5 + ' - $' + BlackSholes.Vcall_europe(1199.62, strike + i*5, .3428, 0.0, expiration.diff(moment(), 'days'), 0.0));
	}

	console.log(BlackSholes.impliedVolatility(1202, 1000, 258.55, 0, expiration.diff(moment(), 'days'), 0));
}

AAPL();
PCLN();




