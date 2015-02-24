//contains miscellaneous functions for use in this project

	var randInt = function(max) {//[0..max)
  		return Math.floor(Math.random() * max);
	}
	
	
	
	//createDie is used to turn input given by parse() into a Die
	//note that parse returns an array, the resultant should be unboxed
	//before being used in createDie
	var strsDice = ["add","multiply","max","subtract"];
 	var constrsDice = [AddDie,MultiplyDie,MaxDie,SubtractDie];
 	var createDie = function(input){
 		if(input instanceof Array){
 			if(strsDice.indexOf(input[0])>-1){
 				return new constrsDice[strsDice.indexOf(input[0])](input.slice(1).map(createDie));
 			}
 			return new ComplexDie(input);
 		}else{
 			return new SimpleDie(input);
 		}
 	};
	//function for determining if a given input is a valid number
	//isNaN accepts "" " " and null, these are not numbers - note that for most cases this function is !isNaN	
	var isValid = function(string){
		if(isNaN(string)){
			return false;
		}
		if(string===null||string.trim()===""){
			return false;
		}
		return true;
	}
	//formats numbers like 12345678 into 12,345,678
	//does not work with decimals
	var formatNumber = function(x) { // shamelessly copied from the internet
	 	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
	}	
	
	
	
	
	
	//parse turns input like <(2,{3,4:3}):2> into an array structured as
	//[multiply,[add,2,[3,4,4,4]],[add,2,[3,4,4,4]]]
	//the returned array is used in createDie
	
	var openBracket = "{",closeBracket = "}";//nevermind, don't change these
	var replacements = [["(","{add,"],["<","{multiply,"],["[","{max,"],[")","}"],[">","}"],["]","}"]];
	
	var parse = function(string){
		//preprocessing
		string=string.replace(/\s+/g,"");//remove whitespace
		var tempReplacements = [];
		var strs = string.split(";");
		string=strs[strs.length-1];
		strs=strs.filter(function(argument){return argument.indexOf("=")>-1});
		for(var i = 0; i < strs.length; i++){
			tempReplacements.push(strs[i].split("="));
		}
		tempReplacements.forEach(function(arr){
			while(string.indexOf(arr[0])>-1){
				string=string.replace(arr[0],arr[1]);
			}
		});
		replacements.forEach(function(arr){
			while(string.indexOf(arr[0])>-1){
				string=string.replace(arr[0],arr[1]);
			}
		});
		return recursiveParse(string);
	}
	var recursiveParse = function(string){
		var result = [];
		var begin = [];
		var beginIndex=0;
		var bracket = 0;
		
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
				var tempresult = recursiveParse(temp.substring(1,temp.length-1));
				temp = tempresult;
			}
			for(var i = 0; i < iterations; i++){
				result.push(temp);
			}
			
		});
		return result;
	}
