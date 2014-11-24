function MultiDie(){};
	MultiDie.prototype = new Die();
	MultiDie.prototype.maxValue = function(){
		var max=this.identity;
		this.dice.forEach(function(die){
			max=this.operation(max,die.maxValue());
		},this);
		return max;
	}
	MultiDie.prototype.roll = function(){
		var result = this.identity;
			this.dice.forEach(function(die){
			result=this.operation(result,die.roll());
		},this);
		return result;
	}
	MultiDie.prototype.cdf = function(value){
		return this.probModel.cdf(value);
	}
	MultiDie.prototype.cdfFrac = function(value){
		return this.probModel.cdfFrac(value);
	}
	MultiDie.prototype.createSideValues = function(){
		this.sideValues = this.possibleCombinations(this.dice.length-1).sort(function(a,b){return (Number(a)>Number(b))?1:((a==b)?0:-1);});
		this.sides = this.sideValues.length;
		this.probModel = new ProbabilityModel(this.sideValues);
	}
	MultiDie.prototype.possibleCombinations = function(index){
		var previous = [this.identity];
		var current = this.dice[index].sideValues;
		if(index>0){
			previous = this.possibleCombinations(index-1);		
		}
		var result = new Array(previous.length*this.dice[index].sides);
		for(var i = 0; i < previous.length; i++){	
			for(var j = 0; j < current.length; j++){
				result[i*current.length+j]=this.operation(previous[i],current[j]);
			}
		}
		return result;
	}
	MultiDie.prototype.toString = function(){
		return this.name + "({" + this.dice.join("},{") + "})";
	}
	function AddDie(dice){
		this.dice=dice;
		this.createSideValues();
		
	};
	AddDie.prototype = new MultiDie();
	AddDie.prototype.identity=0;
	AddDie.prototype.name = "add";
	AddDie.prototype.operation = function(a,b){return Number(a)+Number(b);}
	function MultiplyDie(dice){
		this.dice=dice;
		this.createSideValues();
	};
	MultiplyDie.prototype = new MultiDie();
	MultiplyDie.prototype.identity=1;
	MultiplyDie.prototype.name = "multiply";
	MultiplyDie.prototype.operation= function(a,b){return a*b;}
	function MaxDie(dice){
		this.dice=dice;
		this.createSideValues();
	};
	MaxDie.prototype = new MultiDie();
	MaxDie.prototype.identity=-9999;//negative infinity
	MaxDie.prototype.name = "max"
	MaxDie.prototype.operation = function(a,b){return Math.max(a,b);}
