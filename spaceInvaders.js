var canvas = document.getElementById("spaceInvaders");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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



function NPC(x,y){
	this.x = (innerWidth/2) + x-150;
	this.y = (innerHeight-800) + y;
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
		npcProj.push(new npcProjectile(this.x,this.y,2,5));
	}

	this.hitDetection = function(){
		for(var i = 0; i <bullets.length; i++){
			if(bullets[i].y - this.y <0 && (this.x - bullets[i].x < 10 &&  this.x - bullets[i].x > -10)){
			bullets[i].active = false;
			this.alive = false;
		}
		}
		
	}
}

function Ship(width,height){
	this.width = width;
	this.height = height;
	this.x = innerWidth/2 - width/2;
	this.y = innerHeight/2 - height/2;
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
		if(this.y < innerHeight){
			this.drawProj();
			this.y = this.y+2;
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
	this.getY = function(){
		return this.y;
	}
}


//movement 1.0
//მემგონი რო keyUp-ზედმეტად ამატებს მაპში რაღაცას
window.addEventListener('keydown',function(event){
	keyMap[event.keyCode] = event.type == 'keydown';
	console.log(event);
	
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
	if(keyMap[81])npcFire = true;
	if(keyMap[69])shoot = true;

}

function populateNPC(){
	for(var i = 0; i < 2; i++){
		for(var j = 0; j<10; j++){
			npcs.push(new NPC(30*j,20*i));
		}	
	}
}

function arrayCleaner(){
	for(var i = 0; i < bullets.length; i++){
		if(bullets[i].y < 0){
			bullets.shift();
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
}





function animate(){
		requestAnimationFrame(animate);
		c.clearRect(0,0,innerWidth,innerHeight);
//Updating X,Y of ship
		movementContoller();
		draw();
//--------------------

//NPC FIRE Testing 

	// console.log(npcFire);
	if(npcFire === true){
		console.log('shit');
			for(var i = 0; i < npcs.length; i++){
				npcs[i].addProjectile();
			}
			npcFire = false;
		}

	if(shoot === true){
		for(var i = 0; i < npcs.length; i++){
				npcProj[i].shoot();
			}
	}
	

	




//NPC CONTROLLER
		for(var i = 0; i<npcs.length;i++){
			if(npcs[i].alive === true){
				npcs[i].drawNPC();
				npcs[i].hitDetection();
				
			}
		}
//----------------


//Ship Projecitle Controller
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

console.log("hello");