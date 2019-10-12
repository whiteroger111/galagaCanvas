var canvas = document.getElementById("spaceInvaders");

canvas.width = 700
canvas.height = 960;
var background = new Background(0,-960);
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
var backgroundImg = new Image();
backgroundImg.src = 'Background2x.png'
var lives = 3;





function Background(x,y){
	this.x = x;
	this.y = y;
	this.animation = function(){
			c.drawImage(backgroundImg,this.x,this.y);
			this.y+=3;
			if(this.y > 0){
				this.y = -960;
			}
	}
}


//widthC - C stands for canvas
function NPC(x,y){
	this.x = x;
	this.y = y;
	this.width = 10;
	this.height = 5;
	this.alive = true;
	this.drawNPC = function(){
		c.beginPath();
		c.rect(this.x,
			   this.y,
			   this.width,
			   this.height);
		c.fillStyle = 'red';
		c.fill();
	}

	this.move = function(){
		this.y +=5;
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

function npcProjectile(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.active = true;
	this.drawProj = function(){
		c.beginPath();
		c.rect(this.x ,this.y,width,height);
		c.fillStyle = 'red';
		c.fill();
	}

	this.shoot = function(){
		if(this.y - ship.y >0 && (this.x - ship.x >-1  && this.x - ship.x < 39)){
			this.active = false;
			console.log('yes');
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


//Ship stuff needs refactoring | 2 projectile classes are useless 
function Ship(width,height){
	this.width = width;
	this.height = height;
	this.x = widthC/2 - width/2;
	this.y = heightC/2 - height/2;
	// this.hitDetection = function(){
	// 	// console.log('shit');
		
	// 	for(var i = 0; i <npcProj; i++){
			
			
	// 		if((this.x - npcProj[i].x > -40 && this.x - npcProj[i].x < 1 )){
	// 			console.log("yes")
	// 		}
	// 	}
	// }
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
		c.fillStyle = 'blue';
		c.fill();

	}
	this.move = function(){

	}

	this.shoot = function(){
		if(this.y > -20){
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

// redundant at this moment

// function populateNPC(){
// 	for(var i = 0; i < 2; i++){
// 		for(var j = 0; j<10; j++){
// 			npcs.push(new NPC(30*j,20*i));
// 		}	
// 	}
// }

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

function randomSpawn(){
	var locationX = Math.floor(Math.random()*700);
	var locationY = 5;
	var npcRand = new NPC(locationX,locationY);
	npcs.push(npcRand);
}


for(var i = 0; i < 1; i++){
	randomSpawn();
}


function animate(){
		requestAnimationFrame(animate);
		c.clearRect(0,0,widthC,heightC);
		background.animation();	
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
	// populateNPC();
}
init();


