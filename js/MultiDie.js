//MultiDice represent a combination of two or more independent other "dice"
//Each has an operation and an identity to go with it
//SubtractDie is an exception: has no identity, operation is noncommutative/associative, and ignores all but the first two dice
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
	MultiDie.prototype.verboseRoll = function(){
		var resultArr = [];
		var result = this.identity;
		this.dice.forEach(function(die){
			var roll = die.verboseRoll();
			resultArr.push(roll.string);
			result=this.operation(result,roll.number);
		},this);
		return {string:this.createVerboseString(resultArr),number:result};
	}
	MultiDie.prototype.cdf = function(value){
		return this.probModel.cdf(value);
	}
	MultiDie.prototype.cdfFrac = function(value){
		return this.probModel.cdfFrac(value);
	}
	MultiDie.prototype.createProbModel = function(){
		if(!createProbModel)return;
		this.probModel = this.possibleCombinations(this.dice.length-1);
	}
	//recursively creates the probability distribution function of the distribution
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
		this.createProbModel();
		
	};
	AddDie.prototype = new MultiDie();
	AddDie.prototype.identity=0;
	AddDie.prototype.name = "add";
	AddDie.prototype.operation = function(a,b){return Number(a)+Number(b);}
	AddDie.prototype.createVerboseString = function(arr){
		return "("+arr.join("+")+")";
	}
	function MultiplyDie(dice){
		this.dice=dice;
		this.createProbModel();
	};
	MultiplyDie.prototype = new MultiDie();
	MultiplyDie.prototype.identity=1;
	MultiplyDie.prototype.name = "multiply";
	MultiplyDie.prototype.operation= function(a,b){return a*b;}
	MultiplyDie.prototype.createVerboseString = function(arr){
		return "("+arr.join("*")+")";
	}
	function MaxDie(dice){
		this.dice=dice;
		this.createProbModel();
	};
	MaxDie.prototype = new MultiDie();
	MaxDie.prototype.identity=0;//negative infinity
	MaxDie.prototype.name = "max";
	MaxDie.prototype.operation = function(a,b){return Math.max(a,b);}
	MaxDie.prototype.createVerboseString = function(arr){
		return "max("+arr.join(",")+")";
	}
	function SubtractDie(dice){//behavior undefined when given more than 2 dice
		this.dice=dice;
		this.createProbModel();
	}
	//subtraction is not commutative or associative, so it has special logic
	SubtractDie.prototype = new MultiDie();
	SubtractDie.prototype.possibleCombinations = function(){
		var newProb = new ProbabilityModel();
		this.dice[0].probModel.array.forEach(function(q1,key1){
			this.dice[1].probModel.array.forEach(function(q2,key2){
				newProb.add(this.operation(key1,key2),q1*q2);
			},this);
		},this);
		return newProb;
	}
	SubtractDie.prototype.roll = function(){
		return this.dice[0].roll()-this.dice[1].roll();
	}
	SubtractDie.prototype.verboseRoll = function(){
		var first = this.dice[0].verboseRoll();
		var second = this.dice[1].verboseRoll();
		return {string:"("+first.string+"-"+second.string+")",number:first.number-second.number};
	}
	SubtractDie.prototype.identity=undefined;
	SubtractDie.prototype.name = "subtract";
	SubtractDie.prototype.operation = function(a,b){return Number(a)-Number(b);}

	
