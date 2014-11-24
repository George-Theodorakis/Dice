//this whole class may need working around javascript type confusion
	function ProbabilityModel(list){//list soon to be omitted
		this.count=0;
		this.uniques=0;
		this.array=[];
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		var i;
		for(var j in list){
			this.count++;
			i=list[j];
			if(this.array[i]===undefined){
				this.array[i]=1;
				this.uniques++;
			}else{
				this.array[i] = Number(this.array[i])+1;
			}
		}
		
	}
	ProbabilityModel.prototype.add = function(value,quantity){
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		if(this.array[value]===undefined){
			this.uniques++;
			this.array[value]=0;
		}
		this.count+=quantity;
		this.array[value]+=quantity;
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
		return cdfTotal(value)/this.count;
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
