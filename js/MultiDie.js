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
		this.probModel = this.possibleCombinations(this.dice.length-1);
	}
	MultiDie.prototype.possibleCombinations = function(index){
		var previous = new ProbabilityModel();
		
		var current = this.dice[index].probModel;
		if(index>0){
			previous = this.possibleCombinations(index-1);		
		}else{
			previous.add(this.identity,1);
		}
		var result = new ProbabilityModel();
		
		previous.array.forEach(function(quantity1,key1){
			current.array.forEach(function(quantity2,key2){
				var key3 = this.operation(key1,key2);
				var quantity3 = quantity1*quantity2;
				result.add(key3,quantity3);
			},this);
		},this);
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
	MaxDie.prototype.identity=0;//negative infinity
	MaxDie.prototype.name = "max";
	MaxDie.prototype.operation = function(a,b){return Math.max(a,b);}
	function SubtractDie(dice){//behavior undefined when given more than 2 dice
		this.dice=dice;
		this.createSideValues();
	}
	SubtractDie.prototype = new MultiDie();
	SubtractDie.prototype.identity=0;
	SubtractDie.prototype.name = "subtract";
	SubtractDie.prototype.operation = function(a,b){return Number(a)-Number(b);}

	
