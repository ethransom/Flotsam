
function RVector()	//	constructor for RVector
{
	this.x = 0;
	this.y = 0;
}

function RVector(x, y)	//	constructor with initial position
{
	this.x = x;
	this.y = y;
}

RVector.prototype.copy = function()
{
	var newVec = new RVector;
	newVec.x = this.x;
	newVec.y = this.y;
	return newVec;
}

RVector.prototype.length = function()
{
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

RVector.prototype.normalize = function()
{
	mag = this.length();
	this.x /= mag;
	this.y /= mag;
}

RVector.prototype.scale = function(newScale)
{
	this.x *= newScale;
	this.y *= newScale;
}

RVector.prototype.setLength = function(newLength)
{
	this.normalize();
	this.scale(newLength);
}

RVector.prototype.add = function(vec)
{
	this.x += vec.x;
	this.y += vec.y;
}

RVector.prototype.subtract = function(vec)
{
	this.x -= vec.x;
	this.y -= vec.y;
}

function RRect()	//	constructor for Rect
{
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
}

function RRect(x, y, w, h)	//	constructor for Rect
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

RRect.prototype.copy = function()
{
	var newRect = new RRect;
	newRect.x = this.x;
	newRect.y = this.y;
	newRect.w = this.w;
	newRect.h = this.h;
	return newRect;
}

function PointInRect(/*RVector*/ v, /*RRect*/ r)
{
	if (v.x < r.x || v.y < r.y || v.x > r.x + r.w || v.y > r.y + r.h)
		return false;
	else
		return true;
}
