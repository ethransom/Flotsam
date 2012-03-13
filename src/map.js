// Parses level XML
function LoadCollisFromXML(levelName)
{
	var realName = "levels/" + levelName;
	
	xmlDoc = loadXMLDoc(realName);
	if (xmlDoc == null)
	{
		alert("Failed to load level data!");
		return;
	}

	var layerList = xmlDoc.getElementsByTagName("Layer");
	
	var itemList = layerList[0].getElementsByTagName("Item");
	
	// Load Collision Layer
	
	for (var i = 0; i < itemList.length; i++)
	{
		var Positions = itemList[i].getElementsByTagName("Position");
		
		var xval = Positions[0].getElementsByTagName("X")[0].firstChild.nodeValue;
		xxval = parseInt(xval);
		
		var yval = Positions[0].getElementsByTagName("Y")[0].firstChild.nodeValue;
		yyval = parseInt(yval);
		
		//	probably faster to declare these outside this loop?
		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;
		fixDef.filter.categoryBits = COLLIS_WORLD;

		if (itemList[i].getAttribute('xsi:type') == "RectangleItem")
		{
			var width = parseInt(itemList[i].getElementsByTagName("Width")[0].firstChild.nodeValue);
			var height = parseInt(itemList[i].getElementsByTagName("Height")[0].firstChild.nodeValue);
			
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(width/gPhysScale/2, height/gPhysScale/2);
			
			var bodyDef = new b2BodyDef;
			//create object
			bodyDef.type = b2Body.b2_staticBody;
			bodyDef.position.x = xxval/gPhysScale + width/gPhysScale/2;
			bodyDef.position.y = yyval/gPhysScale + height/gPhysScale/2;
			
			world.CreateBody(bodyDef).CreateFixture(fixDef);
		}
		else if (itemList[i].getAttribute('xsi:type') == "CircleItem")
		{
			var radius = parseInt(itemList[i].getElementsByTagName("Radius")[0].firstChild.nodeValue);
			
			fixDef.shape = new b2CircleShape(
				radius / gPhysScale
			);
			
			var bodyDef = new b2BodyDef;
			//create object
			bodyDef.type = b2Body.b2_staticBody;
			bodyDef.position.x = xxval/gPhysScale;// + radius/gPhysScale/2;
			bodyDef.position.y = yyval/gPhysScale;// + radius/gPhysScale/2;
			
			world.CreateBody(bodyDef).CreateFixture(fixDef);
			
		} else {
			alert("BOGUS COLLIS ITEM!");
		}
		
	}
	
	// Load Graphics Layer
	
	var itemList = layerList[1].getElementsByTagName("Item");
	
	for (var i = 0; i < itemList.length; i++)
	{
		var Positions = itemList[i].getElementsByTagName("Position");
		
		var xval = Positions[0].getElementsByTagName("X")[0].firstChild.nodeValue;
		var xxval = parseInt(xval);
		
		var yval = Positions[0].getElementsByTagName("Y")[0].firstChild.nodeValue;
		var yyval = parseInt(yval);
		
		var rotation = parseFloat(itemList[i].getElementsByTagName("Rotation")[0].firstChild.nodeValue);
		
		var Scales = itemList[i].getElementsByTagName("Scale");
		
		var prexscale = Scales[0].getElementsByTagName("X")[0].firstChild.nodeValue;
		var xscale = parseFloat(prexscale);
		
		var yscale = parseFloat(Scales[0].getElementsByTagName("Y")[0].firstChild.nodeValue);
		
		if (prexscale == "NaN")
		{
			//eh...  just skip this one.
		} else if (itemList[i].getAttribute('xsi:type') == "TextureItem")
		{
			var imageAsset = itemList[i].getElementsByTagName("texture_filename")[0].firstChild.nodeValue;
			var pointer = imageAsset.lastIndexOf('\\');

			imageAsset = imageAsset.slice(pointer+1, imageAsset.length);
			imageAsset = "art/" + imageAsset;
		
			thing = new Object;
			initThing(thing);
			thing.name = "worldart" + i;
			
			thing.pos = new RVector(xxval, yyval);
			thing.angle = rotation;
			thing.xscale = xscale;
			thing.yscale = yscale;
		
			thing.typeID = OBJECT_WORLD_GRAPHIC;
			thing.sprite = new Object;
			thing.sprite.scale = 1.0;
			thing.sprite.image = new Image();
			thing.sprite.image.src = imageAsset;//new String(imageAsset);
			
			gThings[gThings.length] = thing;
			
		} else {
			alert("BOGUS GRAPHICS ITEM!");
		}
		
	}
	
	// Load Object Layer
	var itemList = layerList[2].getElementsByTagName("Item");
	
	
	for (var i = 0; i < itemList.length; i++)
	{
		
		var Positions = itemList[i].getElementsByTagName("Position");
		
		var xval = Positions[0].getElementsByTagName("X")[0].firstChild.nodeValue;
		xxval = parseInt(xval);
		
		var yval = Positions[0].getElementsByTagName("Y")[0].firstChild.nodeValue;
		yyval = parseInt(yval);
		
		
		if (itemList[i].getAttribute('xsi:type') == "PathItem")
		{
			//	ignore for a bit...
		}
		else if (itemList[i].getAttribute('xsi:type') == "CircleItem")
		{
			var radius = parseInt(itemList[i].getElementsByTagName("Radius")[0].firstChild.nodeValue);
			
			var hp = 30;	//	default hp
			var range = 200;	//	default range for firing
			var rate = 30;	//	default cannon cooldown
			var strength = 10;	//	default damage of balls
			var shipClass = "";
			
			var Properties = itemList[i].getElementsByTagName("Property");
			
			for (var pIndex = 0; pIndex < Properties.length; pIndex++)
			{
				
				if (Properties[pIndex].getAttribute('Name') == "hp")
				{
					var theStrings = Properties[pIndex].getElementsByTagName("string");
					if (theStrings != undefined && theStrings.length > 0)
						hp = parseInt(theStrings[0].firstChild.nodeValue);
				} else if (Properties[pIndex].getAttribute('Name') == "range")
				{
					var theStrings = Properties[pIndex].getElementsByTagName("string");
					if (theStrings != undefined && theStrings.length > 0)
						range = parseInt(theStrings[0].firstChild.nodeValue);
				} else if (Properties[pIndex].getAttribute('Name') == "rate")
				{
					var theStrings = Properties[pIndex].getElementsByTagName("string");
					if (theStrings != undefined && theStrings.length > 0)
						rate = parseFloat(theStrings[0].firstChild.nodeValue);
				} else if (Properties[pIndex].getAttribute('Name') == "object_type")
				{
					var theStrings = Properties[pIndex].getElementsByTagName("string");
					if (theStrings != undefined && theStrings.length > 0)
						shipClass = theStrings[0].firstChild.nodeValue;
				}
			}

			CreateBadguy(xxval, yyval, radius, hp, range, rate, strength, shipClass);
			
		} else {
			alert("BOGUS OBJECT ITEM!");
		}
	}

}
