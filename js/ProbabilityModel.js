//this whole class may need working around javascript type confusion
	function ProbabilityModel(list){//list must be sorted
		this.count=0;
		this.array={};//haha
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		var i;
		for(var j in list){
			this.count++;
			i=list[j];
			if(this.array[i]===undefined){
				this.array[i]=1;
			}else{
				this.array[i] = Number(this.array[i])+1;
			}
		}
		
	}
	ProbabilityModel.prototype.cdf = function(value){
		if(this.cachedCdf[value]===undefined){
			var total=0;
			for(var i in this.array){
				if(i<=value){
					total+=this.array[i];
				}
				this.cachedCdf[value]=total/this.count;
			}
		}
		return this.cachedCdf[value];
	}
	ProbabilityModel.prototype.pdf = function(value){
		return this.cdf(value)-this.cdf(value-1);
	}
	ProbabilityModel.prototype.cdfFrac = function(value){
		
		if(this.cachedCdfFrac[value]===undefined){
			var total=0;
			for(var i in this.array){
				if(i<=value){
					total+=this.array[i];
				}
				this.cachedCdfFrac[value]=new Fraction(total,this.count);
			}
		}
		return this.cachedCdfFrac[value];
	}
	ProbabilityModel.prototype.pdfFrac = function(value){
		return this.cdfFrac(value).subtract(this.cdfFrac(value-1));
	}
	ProbabilityModel.prototype.chooseRandom = function(){
		var result = randInt(this.count);
	}
