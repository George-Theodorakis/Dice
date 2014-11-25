var dice = [];
window.onload = function(){
		document.getElementById("button").onclick = function(){
			var trials = document.getElementById("trials").value;
	 	 	var result = {};
	 	 	updateDice();
 	 		var start = new Date().getTime();			
 	 	 	result.simulation=runSimulation([dice[0]],[dice[1]],trials);
	 	 	var end = new Date().getTime();
			try{
				result.probFrac1=calculateProbFrac([dice[0]],[dice[1]]);
				result.probFrac2=calculateProbFrac([dice[1]],[dice[0]]);
			}catch(err){
				console.log(err);
				result.probFrac1 = "Cannot calculate exact";
				result.probFrac2 = "Cannot calculate exact";
			}
			result.prob1=calculateProb([dice[0]],[dice[1]]);
			result.prob2=calculateProb([dice[1]],[dice[0]]);
	
			document.getElementById("simulPerSecond").value=(trials*1000/(end-start));
			document.getElementById("experimentalOut1").value=result.simulation[0];	
			document.getElementById("experimentalOut2").value=result.simulation[1];
			document.getElementById("theoreticalOut1").value=result.prob1;
			document.getElementById("theoreticalOutFrac1").value=result.probFrac1;
			document.getElementById("theoreticalOut2").value=result.prob2;
			document.getElementById("theoreticalOutFrac2").value=result.probFrac2;
		}
	}
	var updateDice = function(){
		var firstDice = document.getElementById("firstIn").value;
		var secondDice = document.getElementById("secondIn").value;
		var firstDiceArray = parse(firstDice).map(createDie);
	 	var secondDiceArray = parse(secondDice).map(createDie);
 	 	dice[0] = firstDiceArray[0];
 	 	dice[1] = secondDiceArray[0];
	}
	var showDice = function(index){
		updateDice();
		alert(dice[index]);
	}
	var rollDice = function(index){
		updateDice();
		alert(dice[index].roll());
	}
	var randInt = function(max) {//[0..max)
  		return Math.floor(Math.random() * max);
	}
	var maxRoll = function(dice){
		var max = 0;
		for(var i = 0; i < dice.length; i++){
			max = Math.max(max,dice[i].roll());
		}
		return max;
	}
	var runSimulation = function(firstDice,secondDice,trials){
		var wins1 = 0,wins2=0;
		var diff;
		for (var i = 0; i < trials; i++)
		{
			diff = maxRoll(firstDice)-maxRoll(secondDice);
			if (diff>0)
			{
				wins1++;
			}else if(diff<0){
				wins2++;
			}
		}
		
		return [wins1/trials,wins2/trials];
		
	
	}
	var calculateProb = function(firstDice,secondDice){
		
	 	var firstMaxSides=0;
		var prob = 0;
	 	for(var i=0; i < firstDice.length; i++){
	 	 	firstMaxSides=Math.max(firstMaxSides,firstDice[i].maxValue());
	 	}
		for (var i = 2; i <= firstMaxSides; i++)
		{
			prob+=pdf(i, firstDice)*cdf(i - 1, secondDice);
		}
		return prob;
	}
	var calculateProbFrac = function(firstDice,secondDice){
		var prob = new Fraction(0,1);
	  	var firstMaxSides=0;
		for(var i=0; i < firstDice.length; i++){
	 	 	firstMaxSides=Math.max(firstMaxSides,firstDice[i].maxValue());
	 	}
		for (var i = 2; i <= firstMaxSides; i++)
		{
			prob = prob.add(pdfFrac(i, firstDice).multiply(cdfFrac(i - 1, secondDice))).simplify();
		}
		return prob;
	
	}
	var pdf = function(value,dice){
		return cdf(value,dice)-cdf(value-1,dice);
	}
	var cdf = function(value,dice){
		var result=1;
		dice.forEach(function(die){
			result*=die.cdf(value);
		});
		return result;
	}
	var pdfFrac = function(value,dice){
		return cdfFrac(value,dice).subtract(cdfFrac(value-1,dice));
	}
	var cdfFrac = function(value,dice){
		var result=new Fraction(1,1);
		dice.forEach(function(die){
			result=result.multiply(die.cdfFrac(value));
		});
		return result;
	}
	var strsDice = ["add","multiply","max"];
 	var constrsDice = [AddDie,MultiplyDie,MaxDie];
 	var createDie = function(input){
 		if(input instanceof Array){
 			if(strsDice.indexOf(input[0])>-1){
 				return new constrsDice[strsDice.indexOf(input[0])](input.slice(1).map(createDie));
 			}
 			return new ComplexDie(input);
 		}else{
 			return new SimpleDie(input);
 		}
 	}
	var gcd = function(a, b) { //this function shamelessly copied from internet
	 	 if ( ! b) { 
	 	 	return a; 
	 	 }
	 	 return gcd(b, a % b); 
	}
	var isValid = function(string){//isNaN accepts "" " " and null, these are not numbers - note that for most cases this is !isNaN
		if(isNaN(string)){
			return false;
		}
		if(string===null||string.trim()===""){
			return false;
		}
		return true;
	}
	var formatNumber = function(x) { //also shamelessly copied from the internet
	 	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
	}	
	var openBracket = "{",closeBracket = "}";//nevermind, don't change these
	var replacements = [["(","{add,"],["<","{multiply,"],["[","{max,"],[")","}"],[">","}"],["]","}"]];
	var parse = function(string){
		var result = [];
		var begin = [];
		var beginIndex=0;
		var bracket = 0;
		replacements.forEach(function(arr){
			while(string.indexOf(arr[0])>-1){
				string=string.replace(arr[0],arr[1]);
			}
		});
		string=string+',';
		for(var i = 0; i < string.length; i++){
			if(string.charAt(i)===closeBracket){
				bracket--;
			}
		
			if(string.charAt(i)===openBracket){
				bracket++;
			}
			if(bracket==0&&string.charAt(i)===','){
				begin.push(string.substring(beginIndex,i));
				beginIndex=i+1;
			}
		
		}
		begin=begin.map(function(str){return str.trim()});
		begin.forEach(function(value){
			var split = ["","1"];
			var lastIndex = value.lastIndexOf(":");
			if(lastIndex>=-1){
				if(value.lastIndexOf("}")<lastIndex){
					split[0] = value.substring(0,lastIndex);
					split[1] = value.substring(lastIndex+1);
				}else{
					split[0] = value;
				}
			}
			
			var temp = split[0];
			var iterations=1;
			if(isValid(split[1])){
				iterations=split[1];	
			}
			if(temp.indexOf(openBracket)>-1){
				var tempresult = parse(temp.substring(1,temp.length-1));
				temp = tempresult;
			}
			for(var i = 0; i < iterations; i++){
				result.push(temp);
			}
			
		});
		return result;
	}
