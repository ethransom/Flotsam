
//------------------------------------------------------

var gHudHealth = 50;
var gHudHealthMax = 100;

var gHudLevelTime = 100;
var gHudLevelTimeMax = 100;

var gHudScore = 291;

//var gHudShipSize = 291;

//SCREEN_WIDTH, SCREEN_HEIGHT

//------------------------------------------------------

function drawHUD()
{
/* 
	ctx.fillStyle = 'E07E1B';
	ctx.fillRect( 40, SCREEN_HEIGHT - 55 , SCREEN_WIDTH - 80, 35); */
	
	
	//Health/Fire bar	
	ctx.fillStyle = '33281E';
	ctx.fillRect( 50-2, SCREEN_HEIGHT - 50-2 , 1 * (SCREEN_WIDTH - 100)+4, 18+4);
	
	ctx.fillStyle = '33281E';
	ctx.fillRect( 50-2, SCREEN_HEIGHT - 50-2 , (gHudHealth / gHudHealthMax) * (SCREEN_WIDTH - 100)+4, 18+4);
	
	ctx.fillStyle = 'E3A81E';
	ctx.fillRect( 50, SCREEN_HEIGHT - 50 , (gHudHealth / gHudHealthMax) * (SCREEN_WIDTH - 100), 18);
	

	//Score counter
	ctx.fillStyle = 'black';
	ctx.font = '30px Macondo Swash Caps';
	ctx.fillText("Infamy: "+gHudScore,25,25);
	
	//Level timer	
	var secs = gHudLevelTime % 60;
	var mins = Math.floor(gHudLevelTime / 60);
	ctx.fillText( "Time " + mins+":"+Math.floor(secs),SCREEN_WIDTH - 190,25);	//(gHudLevelTime/ gHudLevelTimeMax)*100 + "%"
	
	ctx.fillStyle = 'black';
	ctx.font = '20px Macondo Swash Caps';
	ctx.fillText("Time To Fireball", 52,SCREEN_HEIGHT - 60-2);
/* 	
	ctx.save();
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = '#c3c3c3';
	ctx.beginPath();
	ctx.arc(
		SCREEN_WIDTH / 2,	//x
		25,	//y
		20	//radius
		,0	//start angle
		,(Math.PI*2)*(gHudLevelTime/ gHudLevelTimeMax));
	ctx.fill();
	
	ctx.restore(); */
}
