var canvas = document.getElementById("spaceInvaders");

canvas.width = 700
canvas.height = 960;

var widthC = 700;
var heightC = 960;
var c = canvas.getContext('2d');
var bullets = [];
var fire = false;
var ship = new Ship(40,40);
var keyMap = {};
var projTiming = 0;
var npcs = [];
var npcProj = [];
var npcFire = false;
var shoot = false;
var spawnRate = 0;
var drawShip = true;
var background = new Image();
background.src = 'space_700_960.png'




//widthC - C stands for canvas
function NPC(x,y){
	this.x = (widthC/2) + x-150;
	this.y = (heightC - (heightC*80)/100) + y;
	this.width = 10;
	this.height = 5;
	this.alive = true;
	this.drawNPC = function(){
		c.beginPath();
		c.rect(this.x,
			   this.y,
			   this.width,
			   this.height);
		c.stroke();
	}


	this.addProjectile = function(){
		npcProj.push(new npcProjectile(this.x + this.width/2,this.y,2,5));
	}

	//here is bug when ship is behind npc-s and you shoot npcs are getting hitted - (kinda fixed needs better solution)
	this.hitDetection = function(){
		for(var i = 0; i <bullets.length; i++){
			if(ship.y > this.y && bullets[i].y - this.y <0 && 
			(this.x - bullets[i].x < 10 &&  this.x - bullets[i].x > -10)){
			bullets[i].active = false;
			this.alive = false;
		}
		}
		
	}
}

function Ship(width,height){
	this.width = width;
	this.height = height;
	this.x = widthC/2 - width/2;
	this.y = heightC/2 - height/2;
}


function npcProjectile(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.active = true;
	this.drawProj = function(){
		c.beginPath();
		c.rect(x = this.x,y = this.y,width,height);
		c.fillStyle = 'red';
		c.fill();
	}

	this.shoot = function(){
		if(this.y > ship.y && (this.x - ship.x < 10 && this.x - ship.x > -10)){
			console.log("yes");
		}

		if(this.y < heightC){
			this.drawProj();
			this.y = this.y+2;
			if(this.y > heightC){
				this.active = false;
			}
		}
	}
}


function Projectile(width,height){
	this.fire = false;
	this.width = width;
	this.height = height;
	this.x = ship.x+ship.width/2;
	this.y = ship.y;
	this.active = true;
	this.drawProj = function(){
		c.beginPath();
		c.rect(this.x,this.y,width,height);
		c.stroke();

	}

	this.shoot = function(){
		if(this.y > 0){
			this.drawProj();
			this.y = this.y-2;
		}
	}
}


//movement 1.0
window.addEventListener('keydown',function(event){
	keyMap[event.keyCode] = event.type == 'keydown';
});

window.addEventListener('keyup',function(event){
	keyMap[event.keyCode] = event.type == 'keydown';
});

function movementContoller(){
	if(keyMap[87])ship.y -= 2;
	if(keyMap[65])ship.x -= 2;
	if(keyMap[83])ship.y += 2;
	if(keyMap[68])ship.x += 2;
	if(keyMap[32])fire = true;
	//test
}


function populateNPC(){
	for(var i = 0; i < 2; i++){
		for(var j = 0; j<10; j++){
			npcs.push(new NPC(30*j,20*i));
		}	
	}
}

// clear projectile arrays
function arrayCleaner(){
	for(var i = 0; i < bullets.length; i++){
		if(bullets[i].y < 0){
			bullets.shift();
		}
	}

//Deletes NPC from array
	for(var i = 0; i < npcs.length; i++){
		if(npcs[i].alive === false)npcs.splice(i,1);
	}

	for(var i = 0; i < npcProj.length; i++){
		if(npcProj[i].active === false){
			npcProj.shift();
		}
	}

}




//create spaceship
function draw(){
	c.beginPath();
	c.rect(ship.x,
		   ship.y,
		   ship.width,
		   ship.height);
	c.stroke();
	c.fillStyle = 'white';
	c.fill();
}





function animate(){
		requestAnimationFrame(animate);
		c.clearRect(0,0,widthC,heightC);
		c.drawImage(background,0,0);
		
//Updating X,Y of ship
		movementContoller();
		if(drawShip = true)draw();
		
//--------------------

//NPC CONTROLLER
		if(Date.now() - spawnRate > 1000){
			spawnRate = Date.now(); 
			for(var i = 0; i < npcs.length; i++){
				npcs[i].addProjectile();
			}
		}

		for(var i = 0; i < npcProj.length; i++){
				npcProj[i].shoot();
			}

		for(var i = 0; i<npcs.length;i++){
			if(npcs[i].alive === true){
				npcs[i].drawNPC();
				npcs[i].hitDetection();
				
			}
		}
//----------------
		
		
//Ship Projectile Controller
		if(fire === true && (Date.now()-projTiming) > 500){
				projTiming = Date.now();
				bullets.push(new Projectile(2,5,ship.x/2,ship.y));
				fire = false;
		}
		for(var i = 0; i < bullets.length;i++){
			if(bullets[i].active)bullets[i].shoot();
		}
//--------------------------

//Cleaning Projectile Array From Inacative ones
		arrayCleaner();

}
animate();


//Game Initialization


function init(){
	draw();
	populateNPC();
}
init();

