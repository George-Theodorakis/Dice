
var calculateWindow = function(probModels){
	//we want each to be scaled relative to each other - if one goes up to 100, the other should.  Constant bar area = same probability
	var maxSize=0,maxValue=-Infinity,minValue=Infinity;
	probModels.forEach(function(probModel){
		maxSize = Math.max(maxSize,probModel.maxQuantity/probModel.count);
		maxValue = Math.max(maxValue,probModel.maxIndex);
		minValue = Math.min(minValue,probModel.minIndex);
	});
	maxSize=Math.max(2/(maxValue-minValue+1),maxSize);//ensure that no graph takes up over half the available area
	return {ymax:maxSize, xmin:minValue-.5, xmax:maxValue+.5};//render in center
}

//window.xmin,window.xmax,window.ymax
//flags.histogram,flags.normal,flags.box
var drawCanvas = function(canvas,probModel,window,flags){
	clearCanvas(canvas);
	var context = canvas.getContext("2d");
	if(flags.histogram){
		drawHistogram(context,probModel,window,canvas.width,canvas.height);
	}
	if(flags.box){
		drawBoxPlot(context,probModel,window,canvas.width,canvas.height);
	}
	if(flags.normal){
		drawNormalCurve(context,probModel,window,canvas.width,canvas.height);
	}
}

var clearCanvas = function(canvas){
	var context = canvas.getContext("2d");
	context.fillStyle = "#ffffff";
	context.beginPath();
	context.rect(0,0,canvas.width,canvas.height);
	context.fill();
}
var transformX = function(x,width, xmin, xmax){
	return (x-xmin)/(xmax-xmin)*width;
}
var drawHistogram = function(context, probModel,window,width,height){
	var fillColor = "#44aa22";
	var outlineColor = "#225511";
	var maxSize=window.ymax*probModel.count;
	var maxValue = window.xmax;
	var minValue = window.xmin;
	var range = maxValue - minValue;
	context.fillStyle=fillColor;
	context.strokeStyle=outlineColor;
	var size,value;
	probModel.sortedArr.forEach(function(pair){
		value=pair[0];
		size=pair[1];
		value-=minValue;
		var topy = height*(1-size/maxSize);
		var leftx = width*(value-.5)/range;
		var rightx = width*(value+.5)/range;
		context.beginPath();
		context.rect(leftx,topy,rightx-leftx,height-topy);
		context.fill();
		context.stroke();
	});
}

var drawBoxPlot = function(context,probModel,window,width,height){
	context.fillStyle = "rgba(210, 180, 140, 0.7)";
	context.strokeStyle = "rgba(52,45,35,1)";
	var quartiles = probModel.quartiles();
	var xs = quartiles.map(function(x){return transformX(x,width,window.xmin,window.xmax);});
	var ylow=height*3/4;
	var ymed = height/2;
	var yhigh = height/4;
	
	context.beginPath();	
	context.rect(xs[1],yhigh,xs[3]-xs[1],ylow-yhigh);
	context.fill();
	
	
	
	
	//massive drawing call
	context.beginPath();
	//left branch
	context.moveTo(xs[0],ylow);
	context.lineTo(xs[0],yhigh);
	context.moveTo(xs[0],ymed);
	context.lineTo(xs[1],ymed);
	//middle
	context.rect(xs[1],yhigh,xs[3]-xs[1],ylow-yhigh);
	context.moveTo(xs[2],yhigh);
	context.lineTo(xs[2],ylow);
	//right branch
	context.moveTo(xs[4],ylow);
	context.lineTo(xs[4],yhigh);
	context.moveTo(xs[4],ymed);
	context.lineTo(xs[3],ymed);
	context.stroke();
	
	
	
}



var drawNormalCurve = function(context, probModel,window,width,height){
	var outlineColor = "#aa4422";
	context.strokeStyle = outlineColor;
	context.beginPath();
	var xstep=.5;
	var mean = probModel.mean();
	var stDev = probModel.stDev();
	for(var x = window.xmin; x <window.xmax+xstep; x+=xstep){
		var zscore = (x-mean)/stDev;
		context.lineTo(transformX(x,width,window.xmin,window.xmax),height*(1-normPdf(zscore,stDev)/window.ymax));
	}
	context.stroke();
}

var normalMultiplier = 1/Math.sqrt(2*Math.PI);
var normPdf = function(z,sigma){
	return Math.exp(-z*z/2)*normalMultiplier/sigma;
}









