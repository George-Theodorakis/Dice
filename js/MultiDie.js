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
		var possibleCombins = this.possibleCombinations(this.dice.length-1);
		this.probModel = new ProbabilityModel(this.sideValues);
		possibleCombins.forEach(function(value,key){
			this.probModel.add(key,value);
		},this);
	}
	MultiDie.prototype.possibleCombinations = function(index){
		var previous = [];
		
		var current = this.dice[index].probModel.array;
		if(index>0){
			previous = this.possibleCombinations(index-1);		
		}else{
			previous[this.identity]=1;
		}
		var result = new Array(previous.length*this.dice[index].probModel.array.uniques);
		
		previous.forEach(function(quantity1,key1){
			current.forEach(function(quantity2,key2){
				var key3 = this.operation(key1,key2);
				var quantity3 = quantity1*quantity2;
				result[key3] = quantity3;
			},this);
		},this);
		for(var i = 0; i < previous.length; i++){	
			for(var j = 0; j < current.length; j++){
				result[i*current.length+j]=[this.operation(previous[i],current[j]);
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
