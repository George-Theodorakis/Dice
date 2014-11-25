var drawOnCanvas = function(canvas, probModel,params){
	var fillColor = "#44aa22";
	var outlineColor = "#225511";
	
	var context = canvas.getContext("2d");
	context.fillStyle=fillColor;
	context.strokeStyle=outlineColor;
	var width = canvas.width;
	var height = canvas.height;
	context.beginPath();
	context.clearRect(0,0,width,height);
	var maxSize = params.maxSize;
	var maxValue = params.maxValue;
	drawWithParams(context,0,0,width,height,probModel,maxSize*probModel.maxValue,maxValue);
}
var drawWithParams = function(context,xleft,ytop,width,height,probModel,maxSize,maxValue){
	probModel.array.forEach(function(size,value){
		var topy = height*(1-size/maxSize);
		var leftx = width*(value-1)/maxValue;
		var rightx = width*(value)/maxValue;
		context.beginPath();
		context.rect(xleft+leftx,ytop+topy,rightx-leftx,height-topy);//sorry about these variable names
		context.fill();
		context.stroke();
	});
}
var calculateParams = function(probModels){
	//we want each to be scaled relative to each other - if one goes up to 100, the other should.  Constant bar area = same probability
	var maxSize=0,maxValue=0;
	probModels.forEach(function(probModel){
		maxSize = Math.max(maxSize,probModel.maxValue/probModel.count);
		maxValue = Math.max(maxValue,probModel.array.length-1);
	});
	return {maxSize:maxSize, maxValue:maxValue};
}
var drawCanvases = function(){
	var probs = dice.map(function(die){return die.probModel;});
	var params = calculateParams(probs);
	drawOnCanvas(document.getElementById("canvas1"),probs[0],params);
	
	drawOnCanvas(document.getElementById("canvas2"),probs[1],params);
}
