//this whole class may need working around javascript type confusion
	function ProbabilityModel(list){//list soon to be omitted
		this.count=0;
		this.array=[];
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
	ProbabilityModel.prototype.add = function(value,quantity){
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		if(this.array[value]===undefined){
			this.array[value]=quantity;
		}
		this.array[value]+=quantity;
	}
	ProbabilityModel.prototype.cdf = function(value){
		if(this.cachedCdf[value]===undefined){
			var total=0;
			this.array.forEach(function(quantity,i){
				if(i<=value){
					total+=quantity;
				}
				this.cachedCdf[value]=total/this.count;
			},this);
		}
		return this.cachedCdf[value];
	}
	ProbabilityModel.prototype.pdf = function(value){
		return this.cdf(value)-this.cdf(value-1);
	}
	ProbabilityModel.prototype.cdfFrac = function(value){
		if(this.cachedCdfFrac[value]===undefined){
			var total=0;
			this.array.forEach(function(quantity,i){
				if(i<=value){
					total+=quantity;
				}
				this.cachedCdfFrac[value]=new Fraction(total,this.count);
			},this);
		}
		return this.cachedCdfFrac[value];
	}
	ProbabilityModel.prototype.pdfFrac = function(value){
		return this.cdfFrac(value).subtract(this.cdfFrac(value-1));
	}
	ProbabilityModel.prototype.chooseRandom = function(){
		var result = randInt(this.count);
	}
