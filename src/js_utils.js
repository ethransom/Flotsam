
//	general inheritance support
Function.prototype.inheritsFrom = function( parentClass )
{
	//Normal Inheritance 
	//this.prototype = new parentClass;	//	hmm... this instantiates one of the objects.  Do we really want this?
	
	//	Let's try this...  See http://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript/1598077#1598077
	//	this avoids instantiating an actual new parentClass.
	//	instead, it transfers all the prototype values of the base class to a new temp object,
	//	and instantiates one of those as our new prototype.
	//	This is still weird, but doesn't end up calling parentClass's constructor,
	//	which is the key lame thing we want to avoid.
	_subclassOf.prototype = parentClass.prototype;
	this.prototype = new _subclassOf();
	
	this.prototype.constructor = this;
	this.prototype.parentConstructor = parentClass;
	this.prototype.parent = parentClass.prototype;
	return this;
}
function _subclassOf() {};	//	used above

//	util to load xml doc
function loadXMLDoc(dname)
{
	if (window.XMLHttpRequest)
	{
		xhttp= new XMLHttpRequest();
	}
	else
	{
		xhttp= new ActiveXObject("Microsoft.XMLHTTP");
	}
	//xhttp.overrideMimeType('text/xml');
	xhttp.open("GET", dname, false);
	xhttp.send();
	return xhttp.responseXML;
}

//	util to load json doc
//	todo refactor with function above - which is more correct?
function loadJSONObject(dname)
{
	var my_JSON_object = {};

	if (window.XMLHttpRequest)
	{
		xhttp= new XMLHttpRequest();
	}
	else
	{
		xhttp= new ActiveXObject("Microsoft.XMLHTTP");
	}
	//xhttp.overrideMimeType('text/plain');
	//	todo:  this request is synchronous, which could be bad?  switch to async?  maybe OK if the file is expected to be local!
	xhttp.open("GET", dname, false);
	xhttp.send();
	
	my_JSON_object = JSON.parse(xhttp.responseText);
	
	return my_JSON_object;
}
