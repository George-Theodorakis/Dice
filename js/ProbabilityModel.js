//this whole class may need working around javascript type confusion
var negOffset = 1<<50;//close to floating point precision limit.
	function ProbabilityModel(){
		this.count=0;
		this.uniques=0;
		this.array=[];
		this.arrayNeg=[];
		this.arrayNegAsc=[];
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		this.minIndex=Infinity;
		this.maxQuantity=0;
		this.sum=0;
		this.calculated=false;
		this.hasNegatives=false;
	}
	ProbabilityModel.prototype.add = function(value,quantity){
		var arr = this.array;
		if(value<0){//support for negative indices
			arr=this.arrayNeg;
			this.hasNegatives=true;
			var negVal = -value
			this.cachedCdf = {};
			this.cachedCdfFrac = {};
			if(arr[negVal]===undefined){
				this.uniques++;
				arr[negVal]=0;
			}
			this.count+=quantity;
			this.sum+=value*quantity;
			arr[negVal]+=quantity;
			this.calculated=false;
			this.maxQuantity = Math.max(this.maxQuantity,arr[value]);
			this.minIndex = Math.min(this.minIndex,value);
			this.array[value]=arr[negVal];
			this.arrNegAsc[value+negOffset]=arr[negVal];
		}
		this.cachedCdf = {};
		this.cachedCdfFrac = {};
		if(arr[value]===undefined){
			this.uniques++;
			arr[value]=0;
		}
		this.count+=quantity;
		this.sum+=value*quantity;
		arr[value]+=quantity;
		this.calculated=false;
		this.maxQuantity = Math.max(this.maxQuantity,arr[value]);
		this.minIndex = Math.min(this.minIndex,value);
	}
	ProbabilityModel.prototype.calculate = function(){
		var mean = this.sum/this.count;
		var count=0;
		var variance=0;
		var quartilesLow = [0];
		var quartilesHigh = [0];
		if(this.hasNegatives){
			this.arrayNegAsc.forEach(function(quantity,value){
				value-=negOffset;
				count+=quantity;
				variance+=quantity*(value-mean)*(value-mean);
				if(!quartilesLow[1]&&count>this.count/4-.5){
					quartilesLow[1]=value;
				}		
				if(!quartilesHigh[1]&&count>=this.count/4+.5){
					quartilesHigh[1]=value;
				}
				if(!quartilesLow[2]&&count>=this.count/2){
					quartilesLow[2]=value;
				}
				if(!quartilesHigh[2]&&count>this.count/2){
					quartilesHigh[2]=value;
				}
				if(!quartilesLow[3]&&count>3*this.count/4-.5){
					quartilesLow[3]=value;
				}
				if(!quartilesHigh[3]&&count>=3*this.count/4+.5){//don't worry about how this works, assuming it works
					quartilesHigh[3]=value;
				}
			},this);
		}
		this.array.forEach(function(quantity,value){
			count+=quantity;
			variance+=quantity*(value-mean)*(value-mean);
			if(!quartilesLow[1]&&count>this.count/4-.5){
				quartilesLow[1]=value;
			}		
			if(!quartilesHigh[1]&&count>=this.count/4+.5){
				quartilesHigh[1]=value;
			}
			if(!quartilesLow[2]&&count>=this.count/2){
				quartilesLow[2]=value;
			}
			if(!quartilesHigh[2]&&count>this.count/2){
				quartilesHigh[2]=value;
			}
			if(!quartilesLow[3]&&count>3*this.count/4-.5){
				quartilesLow[3]=value;
			}
			if(!quartilesHigh[3]&&count>=3*this.count/4+.5){//don't worry about how this works, assuming it works
				quartilesHigh[3]=value;
			}
		},this);
		variance = variance/count;//normalize
		this._variance=variance;
		this._stdev = Math.sqrt(variance);
		var quartiles = [];
		quartiles[0]=this.minIndex;
		quartiles[2]=(quartilesLow[2]+quartilesHigh[2])/2;
		var lowWeight,heightWeight;//for first quartile, flipped for third
		if(this.count%2==0){
			lowWeight=.5;
			highWeight=.5;
		}else if((this.count+1)%4!=0){
			lowWeight=.25;
			highWeight=.75;
		}else{
			lowWeight=.75;
			highWeight=.25;
		}
		quartiles[1]=quartilesLow[1]*lowWeight+quartilesHigh[1]*highWeight;
		quartiles[3] = quartilesLow[3]*highWeight+quartilesHigh[3]*lowWeight;
		quartiles[4] = this.array.length-1;
		this._quartiles=quartiles;
	}
	
	ProbabilityModel.prototype.mean = function(){
		return this.sum/this.count;
	}
	ProbabilityModel.prototype.stDev = function(){
		if(!this.calculated){
			this.calculate();
			this.calculated=true;
		}
		return this._stdev;
	}
	ProbabilityModel.prototype.quartiles = function(){
		if(!this.calculated){
			this.calculate();
			this.calculated=true;
		}
		return this._quartiles;
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
				this.arrayNegAsc.forEach(function(quantity,i){
					i-=negOffset;
					if(i<=value){
						total+=quantity;
					}
				},this);
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
		var num = this.array[value];
		if(num===undefined){
			num=0;
		}
		return num/this.count;
	}
	ProbabilityModel.prototype.cdfFrac = function(value){
		return new Fraction(this.cdfTotal(value),this.count);
	}
	ProbabilityModel.prototype.pdfFrac = function(value){
		var num = this.array[value];
		if(num===undefined){
			num=0;
		}
		return new Fraction(num,this.count);
	}
