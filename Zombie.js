"use strict";

const zombie_ani_info = {
	"idle1": {"start": 0, "stop": 47},
	"idle2": {"start": 48, "stop": 146},
	"walk1": {"start": 147,"stop": 193},
	"walk2": {"start": 194, "stop": 291},
	"run": {"start": 292, "stop": 315},
	"attack1": {"start": 316, "stop": 356},
	"attack2": {"start": 357, "stop": 392},
	"hit": {"start": 393, "stop": 465},
	"die": {"start": 466, "stop": 584}
};

const ZombieState = {
	NONE: -1,
	IDLE: 0,
	WALK: 1,
	RUN: 2,
	ATTACK: 3,
	HIT: 4,
	DIE: 5
};

class Zombie {
	
	constructor(_zombie_model, _animation) {
		this.zombie_model = _zombie_model;
		this.animation = _animation;
		
		this.state = ZombieState.ATTACK;
		if(Math.random() > 0.5) {
			this.walkStyle = 1;
		} else {
			this.walkStyle = 2;
		}
		this.isAlive = true;
		this.aimed = false;
		this.health = 100;
	}
	
	getMesh() {
		return this.zombie_model;
	}
	
	playAni(name) {
		var ani_i = zombie_ani_info[name];
		this.animation.playPart(ani_i["start"], ani_i["stop"]);
	}
	
	setPosition(x, z) {
		this.zombie_model.position.x = x;
		this.zombie_model.position.z = z;
	}
	
	getPosition() {
		return new THREE.Vector2(this.zombie_model.position.x, this.zombie_model.position.z);
	}
	
	translate(v) {
		this.zombie_model.position.x += v.x;
		this.zombie_model.position.z += v.y;
	}
	
	setRotation(r) {
		this.zombie_model.rotation.y = r;
	}
	
	changeState(state) {
		if(this.canInterrupt) {
			this.animation.stop();
		}
		this.state = state;
		this.playedOnce = false;
	}

	run(to) {
		var currentPos = this.getPosition();
		this.speed = 1.5;
		this.direction = currentPos.sub(to).normalize().multiplyScalar(this.speed).negate();
		this.destination = to;

		this.changeState(ZombieState.RUN);

		this.setRotation(Math.PI/2-this.direction.angle());
	}

	walk(to) {
		var currentPos = this.getPosition();
		this.speed = 0.2;
		this.direction = currentPos.sub(to).normalize().multiplyScalar(this.speed).negate();
		this.destination = to;

		this.changeState(ZombieState.WALK);

		this.setRotation(Math.PI/2-this.direction.angle());
	}
	
	idle() {
		if(this.isAlive) {
			this.changeState(ZombieState.IDLE);
		}
	}
	
	hit() {
		console.log(this.isAlive);
		if(this.isAlive) {
			this.changeState(ZombieState.HIT);
			this.health -= 10;
		}
	}
	
	die() {
		this.changeState(ZombieState.DIE);
	}
	
	updatePosition() {
		var currentPos = this.getPosition();		
		var distanceToDest = currentPos.distanceTo(this.destination);
	
		if(distanceToDest > 2) {
			this.translate(this.direction);
		} else {
			this.changeState(ZombieState.IDLE);
		}
	}
	
	update() {
		if(!this.animation.isPlaying) { // interrupt variable
			switch(this.state) {
				case ZombieState.IDLE:
					if(Math.random() < 0.5) {
						this.playAni("idle1");
					} else {
						this.playAni("idle2");
					}
					this.canInterrupt = true;
				break;
				case ZombieState.WALK:
					if(this.walkStyle == 1) {
						this.playAni("walk1");
					} else {
						this.playAni("walk2");
					}
					this.canInterrupt = true;
				break;
				case ZombieState.RUN:
					this.playAni("run");
					this.canInterrupt = true;
				break;
				case ZombieState.ATTACK:
					if(Math.random() < 0.5) {
						this.playAni("attack1");
					} else {
						this.playAni("attack2");
					}
					this.canInterrupt = true;
				break;
				case ZombieState.HIT:
					if(!this.playedOnce) {
						this.playAni("hit");
						this.canInterrupt = true;
						this.playedOnce = true;
					} else {
						this.state = ZombieState.IDLE;
					}
				break;
				case ZombieState.DIE:
					if(!this.playedOnce) {
						this.playAni("die");
						this.canInterrupt = false;
						this.playedOnce = true;
					}
				break;
				
			}
		}
		
		if(this.state == ZombieState.WALK || this.state == ZombieState.RUN) {
			this.updatePosition();
		}
		
		if(this.health <= 0 && this.isAlive) {
			this.die();
			this.isAlive = false;
		}
		
	}
}