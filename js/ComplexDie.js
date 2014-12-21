//ComplexDie subclass of Die
//complex die has arbitrary numbers on each side
//enumeration of each value is given to constructor, duplicates may be included
function ComplexDie(sideValues){
		this.probModel = new ProbabilityModel();
		this.sideValues=sideValues.sort(function(a,b){return (Number(a)>Number(b))?1:((a==b)?0:-1);});//numerical sort
		this.sides=sideValues.length;
		if(createProbModel){
			for(var i =0; i < this.sides; i++){
				this.probModel.add(this.sideValues[i],1);
			}
		}
	}
	ComplexDie.prototype=new Die();
	ComplexDie.prototype.cdf = function(value){
		var count =0;
		for(var i= 0; i < this.sides; i++){
			if(this.sideValues[i]<=value){
				count++;
			}else{
				break;
			}
		}
		return count/this.sides;
	};
	ComplexDie.prototype.cdfFrac = function(value){
		var count =0;
		for(var i= 0; i < this.sides; i++){
			if(this.sideValues[i]<=value){
				count++;
			}else{
				break;
			}
		}
		return new Fraction(count,this.sides);
	};
	ComplexDie.prototype.maxValue = function(){
		return this.sideValues[this.sides-1];
	};
	ComplexDie.prototype.roll = function(){
		return this.sideValues[randInt(this.sides)];
	};
	ComplexDie.prototype.verboseRoll = function(){
		var result = this.sideValues[randInt(this.sides)];
		return {string:result,number:result};
	}
	ComplexDie.prototype.toString = function(){
		return "Die with " + this.sides + " sides of " + this.sideValues;
	};
