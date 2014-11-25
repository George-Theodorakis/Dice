//this whole class may need working around javascript type confusion
	function ProbabilityModel(){
		this.count=0;
		this.uniques=0;
		this.array=[];
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		this.maxValue=0;
		this.sum=0;
	}
	ProbabilityModel.prototype.add = function(value,quantity){
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		if(this.array[value]===undefined){
			this.uniques++;
			this.array[value]=0;
		}
		this.count+=quantity;
		this.sum+=value*quantity;
		this.array[value]+=quantity;
		this.stdev=undefined;
		this.maxValue = Math.max(this.maxValue,this.array[value]);
	}
	ProbabilityModel.prototype.standardDeviation = function(){
		if(stdev===undefined){
			//finish later
		}
		return stdev;
	}
	ProbabilityModel.prototype.cdfTotal = function(value){
		if(this.cachedCdf[value]===undefined){
			if(this.cachedCdf[value-1]!==undefined){
				var total = this.cachedCdf[value-1];
					if(this.array[value]!==undefined){
						total+=this.array[value];
					}
				this.cachedCdf[value] = total;
			}else{
				var total=0;
				this.array.forEach(function(quantity,i){
					if(i<=value){
						total+=quantity;
					}
				},this);
				this.cachedCdf[value] = total;
			}
		}
		return this.cachedCdf[value];
	}
	ProbabilityModel.prototype.cdf = function(value){
		return this.cdfTotal(value)/this.count;
	}
	ProbabilityModel.prototype.pdf = function(value){
		return this.cdf(value)-this.cdf(value-1);
	}
	ProbabilityModel.prototype.cdfFrac = function(value){
		return new Fraction(this.cdfTotal(value),this.count);
	}
	ProbabilityModel.prototype.pdfFrac = function(value){
		return this.cdfFrac(value).subtract(this.cdfFrac(value-1));
	}
	ProbabilityModel.prototype.chooseRandom = function(){
		var result = randInt(this.count);
	}
