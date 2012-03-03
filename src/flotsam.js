/*
 * flotsam.js
 * contains most of the game code
*/

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var gDebug1;
var gDebug2;

var ctx;

var INIT_HERO_HEALTH = 50;
var INIT_LEVEL_TIME = 45;

var GAME_STATE_PLAYING = 0;
var GAME_STATE_LEVEL_SELECT = 1; 
var GAME_STATE_END_SCREEN = 2;
var GAME_STATE_PAUSED = 3;

var BAD_GUY_COLLIS_RADIUS = 2;
var HERO_COLLIS_RADIUS = 1;

var BADGUY_SHOT_LIFE = 2;
var HERO_SHOT_LIFE = 1;

var DAMAGE_FROM_CANNONBALL = 6;

var MOVE_SPEED = 0.7;	//	acceleration (including changing direction)
var MAX_SPEED = 2.25;

var BURN_SPEED = 2;

var PICKUP_DISTANCE = 60;	//	how close before you can pick up a pickup

var fameDisplayCounter = 0;
var fameDisplay;

var gGameState = GAME_STATE_PLAYING;	//	todo fix this

var world;	//	box2d world!

var endingSprite = new Image();
endingSprite.src = "art/menu_art/gameover.png"

//box2d objects
var   b2Vec2 = Box2D.Common.Math.b2Vec2
			,       b2BodyDef = Box2D.Dynamics.b2BodyDef
			,       b2Body = Box2D.Dynamics.b2Body
			,       b2FixtureDef = Box2D.Dynamics.b2FixtureDef
			,       b2Fixture = Box2D.Dynamics.b2Fixture
			,       b2World = Box2D.Dynamics.b2World
			,       b2MassData = Box2D.Collision.Shapes.b2MassData
			,       b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
			,       b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
			,       b2DebugDraw = Box2D.Dynamics.b2DebugDraw
			;

var COLLIS_WORLD = 0x0002;
var COLLIS_BADGUY = 0x0004;
var COLLIS_HERO = 0x0008;

var OBJECT_WORLD = 1;
var OBJECT_WORLD_GRAPHIC = 2;
var OBJECT_BADGUY = 3;
var OBJECT_HERO = 4;
var OBJECT_BULLET = 5;
var OBJECT_PICKUP = 6;
var OBJECT_EFFECT = 7;

var GRAPHIC_RAFT = 0;
var GRAPHIC_BADGUY1 = 1;
var GRAPHIC_BADGUY2 = 2;
var GRAPHIC_BADGUY3 = 3;
var GRAPHIC_BADGUY4 = 4;
var GRAPHIC_BADGUY5 = 5;

var GRAPHIC_HERO1 = 6;
var GRAPHIC_HERO2 = 7;
var GRAPHIC_HERO3 = 8;
//var GRAPHIC_HERO4 = 5;

var GRAPHIC_BULLET = 9;
var GRAPHIC_PICKUP_CANNON = 10;
var GRAPHIC_PICKUP_CREW = 11;
var GRAPHIC_PICKUP_POINTS = 12;

var GRAPHIC_SPLASH = 13;
var GRAPHIC_EXPLOSION = 14;
var GRAPHIC_FIRE = 14;

var gDT = 1/100.0;	//	dtime.  see calculation near framerate update

var gThings = new Array;
//var gNukeList = new Array;
var gHero;

var gPhysScale = 32.0;	//	physics world is smaller than rendering world... maybe for physics behaving nicely?

var gThingSprites = new Array;

var nukeList = new Array;	//	stuff to kill each frame	(not used any more?)

var contactListener;

//	todo: move this to generic module...
var gKeyboardState = new Array;
var KEYBOARD_STATE_ARRAY_SIZE = 200;
var arraySize = KEYBOARD_STATE_ARRAY_SIZE;
while(arraySize--) gKeyboardState.push(false);

function initsprites()
{
	var count = 0;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/raft_small.png";
	GRAPHIC_RAFT = count;
	count++;
	
	//---------------------
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/evil_boat_small.png";
	GRAPHIC_BADGUY1 = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/evil_boat_green.png";
	GRAPHIC_BADGUY2 = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/evil_boat_yellow.png";
	GRAPHIC_BADGUY3 = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/evil_boat_blue.png";
	GRAPHIC_BADGUY4 = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/evil_boat_red.png";
	GRAPHIC_BADGUY5 = count;
	count++;
	
	//---------------------
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/raft_small_1.png";
	GRAPHIC_HERO1 = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/raft_small_2.png";
	GRAPHIC_HERO2 = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/raft_small_3.png";
	GRAPHIC_HERO3 = count;
	count++;
	
	//gThingSprites[count] = new Object;
	//gThingSprites[count].scale = 1.0;
	//gThingSprites[count].image = new Image();
	//gThingSprites[count].image.src = "art/raft_small_3.png";
	//GRAPHIC_HERO4 = count;
	//count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/ball.png";
	GRAPHIC_BULLET = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/raft_cannon_01.png";
	GRAPHIC_PICKUP_CANNON = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 0.1;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/drift_woot_02.png";
	GRAPHIC_PICKUP_CREW = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 0.1;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/drift_woot_02.png";
	GRAPHIC_PICKUP_POINTS = count;
	count++;
	
	//---

	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 1.5;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/splash_02.png";
	GRAPHIC_SPLASH = count;
	count++;

	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 0.5;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/explosions.png";
	GRAPHIC_EXPLOSION = count;
	count++;
	
	gThingSprites[count] = new Object;
	gThingSprites[count].scale = 2.0;
	gThingSprites[count].image = new Image();
	gThingSprites[count].image.src = "art/fire_blob_03.png";
	GRAPHIC_FIRE = count;
	count++;

}

function initThing(thing)
{
	thing.cooldown = 0;
	thing.maxCooldown = 0.5;	//	default cooldown reset
	thing.damageThisTurn = 0;
	thing.health = 20;
	thing.toNuke = false;
	thing.lifeCounter = -1;
	thing.lifeCounterInit = -1;
	thing.extraScale = 1;
	thing.autoroll = 0;
}

// Parses level XML
function LoadCollisFromXML(levelName)
{
	//var levelName = "levels/test_level.xml";
	//if (!isNaN(levelNum))
	//	levelName = "levels/" + levels[levelNum].map;
	var realName = "levels/" + levelName;
	//var realName = "levels/free_for_all.xml";
	
	xmlDoc = loadXMLDoc(realName);
	if (xmlDoc == null)
	{
		alert("BAD LEVEL XML");
		return;
	}

	var test = xmlDoc.childNodes;
	
	var layerList = xmlDoc.getElementsByTagName("Layer");
	
	var itemList = layerList[0].getElementsByTagName("Item");
	
	//	COLLISION
	
	var loopCount = itemList.length;
	for (var i = 0; i < loopCount /*itemList.length*/; i++)
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
		
		//itemList[i]
	}
	
	//	GRAPHICS
	
	var itemList = layerList[1].getElementsByTagName("Item");
	
	var loopEnd = itemList.length;

	for (var i = 0; i < loopEnd; i++)
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
		
		//itemList[i]
	}
	
	//	OBJECTS
	var itemList = layerList[2].getElementsByTagName("Item");
	
	
	var loopEnd = itemList.length;
	for (var i = 0; i < loopEnd; i++)
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

function CreateBadguy(posx, posy, radius, hp, range, rate, strength, shipClass)
{
	var thing = new Object;
	initThing(thing);
	thing.name = "badguy" + posx + "," + posy;
	
	var shipClassList = new Array("white", "green", "yellow", "blue", "red");
	//	EDIT SCORE HERE
	var shipClassScores = new Array(500, 1000, 2000, 1500, 2500);
	var scoreValue = 100;
	
	var shipClassOffset = 0;
	for (var i = 0; i < shipClassList.length; i++)
	{
		if (shipClassList[i] == shipClass)
		{
			shipClassOffset = i;
			scoreValue = shipClassScores[i];
			break;
		}
	}
	
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	
	if (0)//(Math.random() > 0.5)
	{
		var PTM_RATIO = 2;
		fixDef.shape = new b2PolygonShape;
		var S = 1.1;
		var verts = new Array(
			new b2Vec2(0, -S),
			new b2Vec2(S, -0.35 * S),
			new b2Vec2(0.5 * S, 0.6 * S),
			new b2Vec2(-0.5 * S, 0.6 * S),
			new b2Vec2(-S, -0.35 * S)
		);
		fixDef.shape.SetAsArray(verts, verts.length);
	
	} else {
		fixDef.shape = new b2CircleShape(
			BAD_GUY_COLLIS_RADIUS
		);
	}
	
	fixDef.filter.categoryBits = COLLIS_BADGUY;
	fixDef.filter.maskBits = COLLIS_WORLD | COLLIS_HERO;
	
	bodyDef.position.x = posx/gPhysScale;
	bodyDef.position.y = posy/gPhysScale;
	
	bodyDef.userData = thing;
	
	thing.body = world.CreateBody(bodyDef);
	thing.body.CreateFixture(fixDef);	//	what does this do?
	thing.pos = new RVector(posx, posy);
	thing.angle = 0;
	
	thing.typeID = OBJECT_BADGUY;
	
	if (shipClass.substr(0, 3) == "art")	//	assume this is an asset
	{
		thing.sprite = new Object;
		thing.sprite.scale = 1.0;
		thing.sprite.image = new Image();
		thing.sprite.image.src = "" + shipClass + ".png";
		thing.scoreValue = 4000;
	}
	else
	{
		thing.sprite = gThingSprites[GRAPHIC_BADGUY1 + shipClassOffset];
		thing.scoreValue = scoreValue;
	}
	
	
	thing.cooldown = 0;
	
	thing.maxCooldown = rate;
	thing.health = hp;
	thing.range = range;
	thing.strength = strength;
	
	gThings[gThings.length] = thing;
}

function CreateEffect(posx, posy, graphicIndex, time)
{
	var thing = new Object;
	initThing(thing);
	thing.name = "effect" + posx + "," + posy;
	
	thing.pos = new RVector(posx, posy);
	thing.angle = Math.random() * Math.PI*2;
	
	thing.typeID = OBJECT_EFFECT;
	
	thing.sprite = gThingSprites[graphicIndex];
	
	thing.lifeCounter = time;
	thing.lifeCounterInit = time;
	
	if (graphicIndex == GRAPHIC_FIRE)
		thing.autoRoll = Math.random() * Math.PI;
	
	gThings[gThings.length] = thing;
}

// cleanly shuts down the game
function uninit() {
	gThingSprites = new Array;
	var gThings = new Array;
	var gHero = null;

	pauseGame();
}

// starts the game, given a level name
function init(levelName) {

	gHudScore = 0;
	
	gGameState = GAME_STATE_PLAYING;

	gHudLevelTime = gHudLevelTimeMax = INIT_LEVEL_TIME;

	gCanvasElement = document.getElementById("canvas");
	gCanvasElement.addEventListener("click", onClick, false);
	gCanvasElement.addEventListener("mousemove", onMouseMove, false);

	document.addEventListener('keydown',onKeyDown,true);
	document.addEventListener('keyup',onKeyUp,true);
	
	InitSound();

	initsprites();

	world = new b2World(
		//new b2Vec2(0, 10)    //gravity
		new b2Vec2(0, 0)    //no gravity
		,  true                 //allow sleep
	);
	
	//world.SetContactListener(MyContactListener);
	contactListener = new Box2D.Dynamics.b2ContactListener;
	contactListener.PostSolve = postSolve;
	world.SetContactListener(contactListener);

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	var bodyDef = new b2BodyDef;
	
	//	new test
	LoadCollisFromXML(levelName);

	//create some objects
	bodyDef.type = b2Body.b2_dynamicBody;
	//	hero
	var thing = new Object;
	initThing(thing);
	thing.name = "hero";
	
	fixDef.shape = new b2PolygonShape;
	if (0) {
		var S = 0.8;
		var verts = new Array(
			new b2Vec2(0, -S),
			//new b2Vec2(S/3.0, 0),
			new b2Vec2(S + S/2, S),
			new b2Vec2(-S - S/2, S)
			//new b2Vec2(-S/3/0, 0)
			//new b2Vec2(-S/3/0, 0)
		);
		fixDef.shape.SetAsArray(verts, verts.length);
	} else {
		fixDef.shape = new b2CircleShape(
			HERO_COLLIS_RADIUS //radius
		);
	}
	
	bodyDef.userData = thing;
	
	bodyDef.position.x = 0;
	bodyDef.position.y = 0;

	//	make hero heavier, as a test.
	fixDef.density = 2.0;
	
	fixDef.filter.categoryBits = COLLIS_HERO;
	fixDef.filter.maskBits = COLLIS_WORLD | COLLIS_BADGUY;
	
	thing.body = world.CreateBody(bodyDef);
	thing.body.CreateFixture(fixDef);	//	what does this do?
	thing.pos = new RVector(bodyDef.position.x * gPhysScale, bodyDef.position.y * gPhysScale);
	thing.angle = 0;
	
	thing.typeID = OBJECT_HERO;
	thing.sprite = gThingSprites[GRAPHIC_HERO1];
	
	thing.cooldown = 0;

	gThings[gThings.length] = thing;
	gHero = thing;
	gHero.addons = new Array;
	gHero.frame = 0;
	gHero.frameCounter = 0.5;
	gHero.health = INIT_HERO_HEALTH;
	gHudHealth = INIT_HERO_HEALTH;
	gHudHealthMax = INIT_HERO_HEALTH;

	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(gPhysScale);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);
	
	//start game loop
	update();
}

function UpdateObjects()
{
	for (var thingIndex = gThings.length-1; thingIndex >= 0; thingIndex--)
	{
		if (gThings[thingIndex].typeID == OBJECT_BADGUY)
		{
			if (gThings[thingIndex].cooldown > 0)
			{
				gThings[thingIndex].cooldown -= gDT;
			}
	
			var delta = gThings[thingIndex].pos.copy();
			delta.subtract(gHero.pos);
			var dist = delta.length();
			
			if (dist < gThings[thingIndex].range)
			{
				BadGuyFireAt(gThings[thingIndex], gHero.pos);
			}
		}
		
		//	bleh, update other stuff, too.
		if (gThings[thingIndex].typeID == OBJECT_BULLET)
		{
			if (gThings[thingIndex].lifeCounter != -1)
			{
				gThings[thingIndex].lifeCounter -= gDT;
				if (gThings[thingIndex].lifeCounter < 0)
				{
					gThings[thingIndex].toNuke = true;
					
					CreateEffect(gThings[thingIndex].pos.x, gThings[thingIndex].pos.y, GRAPHIC_SPLASH, 0.5);
				}
			}
		}
		
		if (gThings[thingIndex].typeID == OBJECT_EFFECT)
		{
			if (1)//gThings[thingIndex].autoroll != 0)
			{
				gThings[thingIndex].angle += 20 * gDT;//gThings[thingIndex].autoroll * gDT;
			}
			if (gThings[thingIndex].lifeCounter != -1)
			{
				gThings[thingIndex].xscale = gThings[thingIndex].lifeCounter / gThings[thingIndex].lifeCounterInit;
				gThings[thingIndex].yscale = gThings[thingIndex].xscale;
				//gDebug1 = gThings[thingIndex].extraScale;
				gThings[thingIndex].lifeCounter -= gDT;
				if (gThings[thingIndex].lifeCounter < 0)
				{
					gThings[thingIndex].toNuke = true;
				}
			}
		}
	}
}

function CreatePickup(x, y)
{
	thing = new Object;
	initThing(thing);
	thing.name = "pickup";
	
	thing.pos = new RVector(x, y);
	thing.angle = Math.random() * Math.PI;
	thing.xscale = 1.0;
	thing.yscale = 1.0;

	thing.typeID = OBJECT_PICKUP;
	thing.sprite = gThingSprites[GRAPHIC_PICKUP_CANNON];
	
	gThings[gThings.length] = thing;
}

//	kill stuff from health
function HandlePickups()
{
	for (var thingIndex = gThings.length-1; thingIndex >= 0; thingIndex--)
	{
		if (gThings[thingIndex].typeID == OBJECT_PICKUP)
		{
			var delta = gThings[thingIndex].pos.copy();
			delta.subtract(gHero.pos);
			var dist = delta.length();
			if (dist < PICKUP_DISTANCE)
			{
				//	pick up!
				count = gHero.addons.length;
				gHero.addons[count] = new Object;
				gHero.addons[count].typeID = 1;	//	keep track of pickup type!
				gHero.addons[count].cooldown = 0;
				
				//	kill
				gThings.splice(thingIndex, 1);
				
				//	play pickup sound
				PlaySound(SOUND_PICKUP_SELECT);
				
				//	EDIT SCORE HERE
				//	score for pickup
				gHudScore += 100;
			}
		}
	}
}

//
//	cleanly kill this thing, destroying physics, etc.
//
function KillThing(thing)
{
	thing.sprite = undefined;
	if (thing.body != undefined)
		world.DestroyBody(thing.body);
	thing.body = undefined;
}				

//	kill stuff from health
function UpdateAndKillDeadThings()
{
	gHudHealth = gHero.health;
	gHero.health -= gDT * BURN_SPEED;

	for (var thingIndex = gThings.length-1; thingIndex >= 0; thingIndex--)
	{
		if (gThings[thingIndex].damageThisTurn > 0)
		{
			
			gThings[thingIndex].health -= gThings[thingIndex].damageThisTurn;
			gThings[thingIndex].damageThisTurn = 0;
		}
		if (gThings[thingIndex].health <= 0)
		{
			//	todo:  Explosion, and drop pickups
			//	(maybe no physics from those?  just create objects and do our own checking?  dunno what team they'd be on anyway)
			//	you are here
			var x = gThings[thingIndex].pos.x;
			var y = gThings[thingIndex].pos.y;
			
			if (gThings[thingIndex] == gHero)	//	HERO!
			{
				//var points = 1;
				//	EDIT SCORE HERE
				var points = (gHero.addons.length) * 1000;
				
				//	don't actually kill the hero!...
				//alert("death " + gHero.pos.x + " " + gHero.pos.y);
				var curBodyPos = gHero.body.GetPosition();
				//alert("death " + curBodyPos.x + " " + curBodyPos.y);
				
				//	kill health
				gHero.health = INIT_HERO_HEALTH;
				//	turn addons to powerups
				for (var aIndex = 0; aIndex < gHero.addons.length; aIndex ++)	//	do every other one!
				{
					//points *= 10;
					
					if (aIndex > 0)	//	do the rest
					{
						var px = x - 50 + Math.random() * 100;
						var py = y - 50 + Math.random() * 100;
						CreatePickup(px, py);
					}
				}
				gHero.addons.splice(0, gHero.addons.length);
				
				PlaySound(SOUND_DIE_SELECT);
				
				//	respawn...
				var	vec = new Box2D.Common.Math.b2Vec2;
				vec.x = 0;
				vec.y = 0;
				gHero.body.SetPositionAndAngle(vec, 0);
				gHero.pos.x = 0;
				gHero.pos.y = 0;
				
				//	todo play visual effect and set intermediate spawn state variable
				fameDisplayCounter = 3;
				fameDisplay = "Infamy + " + points + "!";
				gHudScore += points;
				
				continue;
			} else {
			
				gHudScore += gThings[thingIndex].scoreValue;
				
				KillThing(gThings[thingIndex]);
				gThings.splice(thingIndex, 1);
				
				CreatePickup(x, y);
			}
			
			
		}
	}
}

// Synchronize box2d positions with visual layer positions?
function updateThingPositions()
{
	for (var i = 0; i < gThings.length; i++)
	{
		if (gThings[i].body != undefined)
		{
			var bpos = gThings[i].body.GetPosition();
			gThings[i].pos.x = bpos.x * gPhysScale;
			gThings[i].pos.y = bpos.y * gPhysScale;
			gThings[i].angle = gThings[i].body.GetAngle();
			
			if (gThings[i].typeID == OBJECT_BADGUY)
				gThings[i].angle = 0;//Math.PI;
		}
	}
	
	//	update hero direction to match velocity.
	var curVec = gHero.body.GetLinearVelocity();
	var myVec = new RVector;
	myVec.x = curVec.x;
	myVec.y = curVec.y;

	gHero.angle = Math.atan2(myVec.x, -myVec.y);

}

var MAX_ADDONS = 16;

//	return relative position of addon
function GetAddonPos(cIndex)
{
	cIndex = cIndex % MAX_ADDONS;	//	limit space selection...

	var xoff = new Array(1, -1, 0, 0, 1, 1, -1, -1,   1, -1, 0, 0, 1, 1, -1, -1);
	var yoff = new Array(0, 0, -1, 1, 1, -1, 1, -1,   0.5, 0.5, -1.5, 1.5, 1.5, -0.5, 1.5, -0.5);

	var newPos = new RVector(xoff[cIndex] * 30, yoff[cIndex] * 30);
	
	return newPos;
}

// Draw the hero's addons?
function DrawExtraHeroStuff()
{
	
	for (var i = 0; i < gHero.addons.length; i++)
	{
		var relPos = GetAddonPos(i);
		
		ctx.save();
		
		var spriteIndex = GRAPHIC_PICKUP_CANNON;
		
		ctx.translate(relPos.x, relPos.y);
		ctx.scale(gThingSprites[spriteIndex].scale, gThingSprites[spriteIndex].scale);
		
		ctx.drawImage(gThingSprites[spriteIndex].image, -gThingSprites[spriteIndex].image.width /2, -gThingSprites[spriteIndex].image.height /2);
		
		ctx.restore();
	}
}


var gViewOffsetX;
var gViewOffsetY;

var lastTimeStamp = new Date().getTime();  
var runningFps = 0;
var runningFpsCount = 0;

function drawstuff()
{
	ctx = document.getElementById("canvas").getContext("2d");

	ctx.fillStyle = "#6040FF";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	ctx.save();
	
	gViewOffsetX = -gHero.pos.x + ctx.canvas.width/2;
	gViewOffsetY = -gHero.pos.y + ctx.canvas.height/2;
	ctx.translate(gViewOffsetX, gViewOffsetY);
	
	for (var i = 0; i < gThings.length; i++)
	{
		var radius = 16;
		ctx.save();
		ctx.translate(gThings[i].pos.x, gThings[i].pos.y);
		ctx.scale(gThings[i].xscale * gThings[i].sprite.scale,
					gThings[i].yscale * gThings[i].sprite.scale);
		ctx.rotate(gThings[i].angle);
		
		if (gThings[i].sprite == gThingSprites[GRAPHIC_HERO1])
		{
			var spriteIndex = GRAPHIC_HERO1 + gThings[i].frame;
			var sprite = gThingSprites[spriteIndex];
			ctx.drawImage(sprite.image, -sprite.image.width /2, -sprite.image.height /2);
		} else {	//	normal
			ctx.drawImage(gThings[i].sprite.image, -gThings[i].sprite.image.width /2, -gThings[i].sprite.image.height /2);
		}
		
		if (gThings[i] == gHero)
			DrawExtraHeroStuff();
		
		ctx.restore();
	}
	
	//used for testing
	//can drain CPU
	//world.DrawDebugData();
	
	ctx.restore();
	
	//	a bunch of timing stuff, both for debug display and for deltatime (DT) calculations
	var now = new Date().getTime();
    var fps = 1000/(now - lastTimeStamp);
	lastTimeStamp = now;
	
	//new = (old * count + now) / (count+1)
	runningFps = (runningFps * runningFpsCount + fps) / (runningFpsCount+1);
	runningFpsCount++;
	
	gDT = 1/runningFps;
	//	artifical limit of dt for systems running so slowly that an accurate dt would be ridiculous.
	if (gDT > 0.1)	//	10fps
		gDT = 0.1;
	
	var dispFps = Math.floor(runningFps * 10)/10;
	var dispDT = Math.floor(gDT * 1000)/1000;
	
	ctx.fillStyle = "#204080";
	ctx.font = "bold 12px monospace";
	ctx.fillText("fps: " + dispFps + "  gdt: " + dispDT, 30, SCREEN_HEIGHT - 10);
	
	if (fameDisplayCounter > 0)
	{
		ctx.fillStyle = 'black';
		ctx.font = '30px Macondo Swash Caps';
		ctx.fillText(fameDisplay, 200, SCREEN_HEIGHT/3 + 30);
		
		ctx.fillText("You are a glorious goblin fireball!", 200, SCREEN_HEIGHT/3);
	}
	
	drawHUD();
	
	ctx.fillStyle = "#302010";
	ctx.lineWidth
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(SCREEN_WIDTH, 0);
	ctx.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT);
	ctx.lineTo(0, SCREEN_HEIGHT);
	ctx.closePath();
	//ctx.fill();
	ctx.lineWidth = 3;
	ctx.stroke();
}

function drawending()
{
	ctx = document.getElementById("canvas").getContext("2d");

	ctx.drawImage(endingSprite, SCREEN_WIDTH/2 -endingSprite.width /2, SCREEN_HEIGHT/2 -endingSprite.height /2);

	ctx.fillStyle = 'black';
	ctx.font = '30px Macondo Swash Caps';
	ctx.fillText("Final Infamy: " + gHudScore, 270, 237);
}

function movestuff()
{

	if (0)//Math.random() > 0.95)
	{

		var index = Math.floor(Math.random() * 14);
		var firstBody = world.GetBodyList();

		for (var i = 0; i < index; i++)
		{
			firstBody = firstBody.GetNext();

			if (firstBody == undefined)
				return;
		}

		var	vec = new Box2D.Common.Math.b2Vec2;
		var pos = new Box2D.Common.Math.b2Vec2;	//GetPosition
		vec.x = (Math.random() * 2 - 1) * 3;
		vec.y = (Math.random() * 2 - 1) * 3;
		pos.x = 0;
		pos.y = 0;

		firstBody.ApplyImpulse(vec, pos);

	}
}

//
//	create bullet
//
function CreateBullet(sourceAngle, sourceX, sourceY, targetX, targetY, baseVelocity, catBits, maskBits, shotLife)
{
	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;
	fixDef.shape = new b2CircleShape(
		0.2 //radius
	);
	//	todo make this an argument
	fixDef.filter.categoryBits = catBits;
	fixDef.filter.maskBits = maskBits;
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	
	var sourcePos = new RVector(sourceX, sourceY);
	bodyDef.position.x = sourceX / gPhysScale;
	bodyDef.position.y = sourceY / gPhysScale;
	//	todo set bullet flag so the system does continuous collision detection?
	
	var thing = new Object;
	initThing(thing);
	thing.name = "bullet";
	
	bodyDef.userData = thing;
	
	thing.typeID = OBJECT_BULLET;
	thing.sprite = gThingSprites[GRAPHIC_BULLET];
	
	thing.body = world.CreateBody(bodyDef);
	thing.body.CreateFixture(fixDef);
	
	//	figure out velocity vector...
	var targetVector = new RVector(targetX, targetY);
	targetVector.subtract(sourcePos);
	targetVector.normalize();
	
	//	scale, converting to physics coordinates at the same time, but also setting a reasonable speed...
	targetVector.scale(5.0);	//	adjust this...
	
	var	vec = new Box2D.Common.Math.b2Vec2;
	vec.x = targetVector.x;
	vec.y = targetVector.y;
	//	add velocity of hero, which is more realistic...
	//	hmm... let's not add too much...
	var heroVec = baseVelocity;//gHero.body.GetLinearVelocity();
	baseVelocity.x /= 2;
	baseVelocity.y /= 2;
	
	vec.x += heroVec.x;
	vec.y += heroVec.y;
	
	thing.body.SetLinearVelocity(vec);
	
	thing.pos = new sourcePos.copy();
	thing.angle = sourceAngle;
	
	thing.lifeCounter = shotLife;	//	in seconds
	
	gThings[gThings.length] = thing;
}

//	hero - fire at somebody
//	hero cooldown is used for main cannon and sound
//	each addon has its own cooldown as well.
function fireAt(screenPos)
{
	//	world pos target
	var targetPos = new RVector;
	targetPos.x = screenPos.x + -gViewOffsetX;
	targetPos.y = screenPos.y + -gViewOffsetY;
		
	if (gHero.cooldown <= 0)
	{
			
		//	successful fire...
		gHero.cooldown = 0.5;	//	time before we can fire again

		PlaySound(SOUND_FIRE_SELECT);

		CreateBullet(gHero.angle, gHero.pos.x, gHero.pos.y, targetPos.x, targetPos.y,
				gHero.body.GetLinearVelocity(), COLLIS_HERO, COLLIS_WORLD | COLLIS_BADGUY, HERO_SHOT_LIFE
		);
	}
	
	//	now fire cannon addons
	for (var cIndex = 0; cIndex < gHero.addons.length; cIndex++)
	{
		//	todo check if cannon...
		
		if (gHero.addons[cIndex].cooldown > 0)
			continue;
		
		gHero.addons[cIndex].cooldown = 0.5 + Math.random() * 0.01;
		
		var sourcePos = GetAddonPos(cIndex);
		sourcePos.add(gHero.pos);
		
		CreateBullet(gHero.angle, sourcePos.x, sourcePos.y, targetPos.x, targetPos.y,
				gHero.body.GetLinearVelocity(), COLLIS_HERO, COLLIS_WORLD | COLLIS_BADGUY, HERO_SHOT_LIFE
		);
	}
}

// Fires bullet from pirates at ship
function BadGuyFireAt(ship, targetPos)
{
	if (ship.cooldown <= 0)
	{
			
		//	successful fire...
		ship.cooldown = ship.maxCooldown;	//	time before we can fire again

		//PlaySound(SOUND_FIRE_SELECT);

		CreateBullet(ship.angle, ship.pos.x, ship.pos.y, targetPos.x, targetPos.y,
				ship.body.GetLinearVelocity(), COLLIS_BADGUY, COLLIS_WORLD | COLLIS_HERO, BADGUY_SHOT_LIFE
		);
	}
}

//
//	handle controls
// TODO: extract to module
function handlekeys()
{
	//var charCode = String.fromCharCode(theCode);	//	need to reverse this search for this and itoa atoi I remember something...
	
	var changedX = false;
	var changedY = false;
	var	vec = new Box2D.Common.Math.b2Vec2;
	vec.x = 0;
	vec.y = 0;
	
	var aKey = "A".charCodeAt();
	if (gKeyboardState[aKey] == true)
    {
		vec.x = -MOVE_SPEED;
		changedX = true;
    }
	
	var dKey = "D".charCodeAt();
	if (gKeyboardState[dKey] == true)
	{
		vec.x = MOVE_SPEED;
		changedX = true;
	}
	
	var upKey = "W".charCodeAt();
	if (gKeyboardState[upKey] == true)
	{
		vec.y = -MOVE_SPEED;
		changedY = true;
	}
	
	var downKey = "S".charCodeAt();
	if (gKeyboardState[downKey] == true)
	{
		vec.y = +MOVE_SPEED;
		changedY = true;
	}
	
	if (changedX || changedY)
	{
		var newVec = gHero.body.GetLinearVelocity();
		if (changedX)
		{
			newVec.x += vec.x;
		}
		if (changedY)
		{
			newVec.y += vec.y;
		}
		
		var checkVec = new RVector;
		checkVec.x = newVec.x;
		checkVec.y = newVec.y;
		var len = checkVec.length();
		gDebug1 = len;
		if (len > MAX_SPEED)
		{
			checkVec.normalize();
			checkVec.scale(MAX_SPEED);
			newVec.x = checkVec.x;
			newVec.y = checkVec.y;
		}
		
		gHero.body.SetAwake(true);
		gHero.body.SetLinearVelocity(newVec);
	}
}

function KillNukeList()
{
	for (var thingIndex = gThings.length-1; thingIndex >= 0; thingIndex--)
	{
		if (gThings[thingIndex].toNuke)
		{
			//	kill the object!
			KillThing(gThings[thingIndex]);
			gThings.splice(thingIndex, 1);
		}
	}
	
}

// Main game loop
function updateGame() {

	gHudLevelTime -= gDT;
	
	if (gHudLevelTime <= 0)
	{
		gHudLevelTime = 0;
		gGameState = GAME_STATE_END_SCREEN;
	}
	
	if (fameDisplayCounter > 0)
		fameDisplayCounter -= gDT;
	
	if (gHero.cooldown > 0)
	{
		gDebug2 = gHero.cooldown;
		gHero.cooldown -= gDT;
		
		for (var i = 0; i < gHero.addons.length; i++)
		{
			if (gHero.addons[i].cooldown > 0)
				gHero.addons[i].cooldown -= gDT;
		}
	}
	
	// Create hero's fire effects
	if (Math.floor(Math.random() * 10) == 0)
	{
		CreateEffect(gHero.pos.x - 30 + Math.random() * 60, gHero.pos.y - 30 + Math.random() * 60, GRAPHIC_FIRE, 0.5);
	}
	
	//animate hero
	gHero.frameCounter -= gDT;
	if (gHero.frameCounter < 0)
	{
		gHero.frame++;
		//gHero.frame += Math.floor(Math.random() * 2);
		gHero.frame = gHero.frame % 3;
		gHero.frameCounter += 0.1;
	}
	
	UpdateObjects();	//	bad guys, bullets, other stuff
	
	handlekeys();
	movestuff();
	
	//	play with rotation.
	gHero.body.SetAngularVelocity(0);
	//gHero.body.SetAngle(0);
	
	world.Step(
		gDT*2
		//1 / 60   //frame-rate
		,  10       //velocity iterations
		,  10       //position iterations
		);
		
	//	detect time up... todo MOVE THIS
	if (0)
	{
		alert("Game Over");
		
		//	game over!
		PlaySound(SOUND_DIE_SELECT);
		
		gGameState = GAME_STATE_END_SCREEN;
		
		cleanUpData();
		
		return;
	}
		
	//	kill any objects from collision resolution
	KillNukeList();
	
	//	kill things that died from health problems
	UpdateAndKillDeadThings();
	
	//	handle pickups
	HandlePickups();
	
	updateThingPositions();
	
	world.ClearForces();
};

function pauseGame() {	gGameState = GAME_STATE_PAUSED;	}

function unpauseGame() {	
	gGameState = GAME_STATE_PLAYING;	
	update();	//restart game loop
}

// Main loop is here
function update()
{
	if (gGameState == GAME_STATE_PLAYING)
		updateGame();
		
	if (gGameState == GAME_STATE_PLAYING)
		drawstuff();
	else if (gGameState == GAME_STATE_END_SCREEN)
	{
		drawstuff();
		drawending();
	}
	
	if ( gGameState != GAME_STATE_PAUSED ) 
		window.requestAnimFrame( update );
}

//provides pollyfill for requestAnimationFrame
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

//http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/
//http://developer.appcelerator.com/question/55121/html5-canvas-drawing-in-webview
//
//	Get mouse position relative to context.
//	This factors in browser differences...
//
function getRealMousePosition(e) 
{
	var pos = new RVector;
 
	if (e.pageX || e.pageY) {
      pos.x = e.pageX;
      pos.y = e.pageY;
    }
    else {
      pos.x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      pos.y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
	pos.x -= gCanvasElement.offsetLeft;
	pos.y -= gCanvasElement.offsetTop;
	
	return pos;
}

//	handle click.  argument is a MouseEvent object.
function onClick(e)
{
	var pos = getRealMousePosition(e);
	
	fireAt(pos);
	
}

function onMouseMove(e)
{
	var pos = getRealMousePosition(e);
	
	//gActiveGame.mouseMove(pos);	
}

// Event handler for keydown event
function onKeyDown(e)
{
	
	var theCode = e.keyCode;
	
	//alert("k " + theCode);
	
	if (theCode < KEYBOARD_STATE_ARRAY_SIZE)
		gKeyboardState[theCode] = true;

	//	kludgey crap...
	if (theCode == "W".charCodeAt())
		gKeyboardState["S".charCodeAt()] = false;
	//	kludgey crap...
	if (theCode == "S".charCodeAt())
		gKeyboardState["W".charCodeAt()] = false;
	//	kludgey crap...
	if (theCode == "A".charCodeAt())
		gKeyboardState["D".charCodeAt()] = false;
	//	kludgey crap...
	if (theCode == "D".charCodeAt())
		gKeyboardState["A".charCodeAt()] = false;
}

function onKeyUp(e)
{
		
	var theCode = e.keyCode;
	
	if (theCode < KEYBOARD_STATE_ARRAY_SIZE)
		gKeyboardState[theCode] = false;

}

function Damage(thing)
{
	if (thing != undefined)
	{
		thing.damageThisTurn += DAMAGE_FROM_CANNONBALL;
		
		if (thing == gHero)
			PlaySound(SOUND_HIT_HERO_SELECT);
		else
			PlaySound(SOUND_HIT_ENEMY_SELECT);
	}
}

function postSolve(contact, impulse)
{
	var fixA = contact.GetFixtureA();
	var fixB = contact.GetFixtureB();
	var bodyA = fixA.GetBody();
	var bodyB = fixB.GetBody();

	var thingA = bodyA.GetUserData();
	var thingB = bodyB.GetUserData();
	
	//	cleaner version
	
	var hitter;
	var victim;
	
	if (thingA != undefined && thingA.typeID == OBJECT_BULLET && thingA.toNuke != true)
	{
		hitter = thingA;
		victim = thingB;
	}
	if (thingB != undefined && thingB.typeID == OBJECT_BULLET && thingB.toNuke != true)
	{
		hitter = thingB;
		victim = thingA;
	}
	
	if (hitter != undefined)
	{
		hitter.toNuke = true;	//	kill ball
		
		if (victim != undefined)
		{
			Damage(victim);
			
			if (victim.typeID == OBJECT_BADGUY || victim.typeID == OBJECT_HERO)
				CreateEffect(hitter.pos.x, hitter.pos.y, GRAPHIC_EXPLOSION, 0.5);
		} else {
			//	hit wall?
			CreateEffect(hitter.pos.x, hitter.pos.y, GRAPHIC_SPLASH, 0.3);	//	puff would be better
		}
	}
	
}
