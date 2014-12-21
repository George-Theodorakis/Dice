//Die is the base class of all probability distribution functions
//it is "abstract", and should not be instantiated directly
function Die(){}//for prototype/inheritance or whatever
	Die.prototype.pdf = function(value){
		return this.cdf(value)-this.cdf(value-1);
	}
	Die.prototype.pdfFrac = function(value){
		return this.cdfFrac(value).subtract(this.cdfFrac(value-1));
	}
