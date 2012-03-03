//	move this to utils file
function rgb_to_string(r, g, b) {
	var s = "#";
	var chars = "0123456789ABCDEF";
	
	s += chars.charAt(r/16);
	s += chars.charAt(r % 16);
	
	s += chars.charAt(g/16);
	s += chars.charAt(g % 16);
	
	s += chars.charAt(b/16);
	s += chars.charAt(b % 16);

	return s;
}

//	move to utils
function draw_fillbar(x, y, w, h, fillCur, fillTotal, backColor, bodyColor, frameColor)
{
	var		fillPoint = fillCur * w / fillTotal;
	
	ctx.fillStyle = backColor;
	ctx.fillRect(x, y, w, h);
	
	ctx.fillStyle = bodyColor;
	ctx.fillRect(x, y, fillPoint, h);
	
	ctx.lineWidth = 1;
	ctx.lineStyle = frameColor;
	ctx.strokeRect(x, y, w, h);
		
}
