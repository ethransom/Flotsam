/* hero.js
 * code pertaining to hero
*/

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
