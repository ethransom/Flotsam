/**
 * Keyboard module
 * Handles Keyboard Input
 * TODO: Make Generic?
*/

var keyStates = {
};

var CONTROLS = {	// TODO: Have these be user defined?
	up: "W",
	down: "S",
	left: "A",
	right: "D"
};

function handlekeys()
{
	var changedX = false;
	var changedY = false;
	var	vec = new Box2D.Common.Math.b2Vec2;
	vec.x = 0;
	vec.y = 0;
	
	if (keyStates[ CONTROLS.left ] == true)
    {
		vec.x = -MOVE_SPEED;
		changedX = true;
    }
	
	if (keyStates[ CONTROLS.right ] == true)
	{
		vec.x = MOVE_SPEED;
		changedX = true;
	}
	
	if (keyStates[ CONTROLS.up ] == true)
	{
		vec.y = -MOVE_SPEED;
		changedY = true;
	}
	
	if (keyStates[ CONTROLS.down ] == true)
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

// Event handler for keydown event
function onKeyDown(e)
{
	var key = String.fromCharCode(e.keyCode);
	
	if( key === "" ) {
		// For non-letter keys
		// Put something better here?
		return;
	}
	
	keyStates[key] = true;
}

function onKeyUp(e)
{
	var key = String.fromCharCode(e.keyCode);
	
	if( key === "" ) {
		// For non-letter keys
		// Put something better here?
		return;
	}

	keyStates[key] = false;
}
