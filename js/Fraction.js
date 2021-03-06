//Fraction represents a fraction class, with the 4 basic operations
//Note that if the result ever exceeds the precision given by floating point precision, a RangeError is thrown
function Fraction(numerator,denominator){
		this.numerator=numerator;
		this.denominator=denominator;
	}
	Fraction.prototype.toString = function(){
	 	return formatNumber(this.numerator) + "/" + formatNumber(this.denominator);
	};
	Fraction.prototype.toNumber = function(){
		return this.numerator/this.denominator;
	}
	Fraction.prototype.add = function(fraction){
		var newDenom = this.leastCommonDenominator(fraction);
		var newNum = this.numerator*(newDenom/this.denominator)+fraction.numerator*(newDenom/fraction.denominator);
		return new Fraction(newNum,newDenom).simplify();
	};
	Fraction.prototype.multiply = function(fraction){
		return new Fraction(this.numerator*fraction.numerator,this.denominator*fraction.denominator).simplify();
	};
	Fraction.prototype.divide = function(fraction){
		return this.multiply(new Fraction(fraction.denominator,fraction.numerator));
	};
	Fraction.prototype.subtract = function(fraction){
		return this.add(new Fraction(-fraction.numerator,fraction.denominator));
	};
	Fraction.prototype.simplify = function(){
	 	var gcd2 = gcd(this.denominator,this.numerator);
	 	var result = new Fraction(this.numerator/gcd2,this.denominator/gcd2);
		if(this.denominator>(1000000000000)||isNaN(this.denominator)){
		 	throw new RangeError("Number exceeds floating point precision: "+this.toNumber());
		}
		return result;
	};
	Fraction.prototype.leastCommonDenominator = function(fraction){
		return this.denominator*fraction.denominator/gcd(this.denominator,fraction.denominator);
	};
	var gcd = function(a, b) { //this function shamelessly copied from internet
	 	 if ( ! b) { 
	 	 	return a; 
	 	 }
	 	 return gcd(b, a % b); 
	};
	
	
	
