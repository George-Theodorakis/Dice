//SimpleDie is subclass of Die, represents uniform discrete distribution
//simple die has sides 1..n - n is argument to constructor
function SimpleDie(sides){	
		this.sides=sides;
		var arr = [];
		if(createProbModel){
		this.probModel = new ProbabilityModel();
			for(var i = 0; i < sides; i++){
				arr.push(i+1);
				this.probModel.add(i+1,1);
			}
			this.sideValues=arr;
		}
	}
	SimpleDie.prototype=new Die();
	SimpleDie.prototype.cdf = function(value){
		return Math.min(value,this.sides)/this.sides;
	}
	SimpleDie.prototype.cdfFrac = function(value){
		return new Fraction(Math.min(value,this.sides),this.sides);
	}
	SimpleDie.prototype.roll = function(){
		return randInt(this.sides)+1;
	}
	SimpleDie.prototype.verboseRoll = function(){
		var result =  randInt(this.sides)+1;
		return {string:result,number:result};
	}
	SimpleDie.prototype.toString = function(){
		return "Die with " + this.sides + " sides"
	}
	SimpleDie.prototype.maxValue = function(){
		return this.sides;
	}
