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
		
		this.state = ZombieState.NONE;

		this.isAlive = true;
		this.aimed = false;
		this.health = Math.random()*20+10;
		
		this.ai = new ZombieAI(this);
	}

    setVisibled(visibled) {
        this.zombie_model.traverse( function ( object ) { object.visible = visibled; } );
    }

	getMesh() {
		return this.zombie_model;
	}
	
	playAni(name) {
		var ani_i = zombie_ani_info[name];
		this.animation.playPart(ani_i["start"], ani_i["stop"]);
	}
	
	setPosition(x, z) {
		this.zombie_model.position.set(x, 0, z);

	}
	
	getPosition() {
		return new THREE.Vector2(this.zombie_model.position.x, this.zombie_model.position.z);
	}
	
    getDistanceToPlayer() {
        var zombie_pos = this.zombie_model.position;
        return controls.getObject().position.distanceTo(zombie_pos);
    }
    
	getState() {
		return this.state;
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
	
	resetState() {
		if(this.state != ZombieState.NONE) {
			this.state = ZombieState.NONE;
			this.animation.stop();
		}
	}

	run(to) {

        var currentPos = this.getPosition();
        this.speed = 1.5;
        this.direction = currentPos.sub(to).normalize().multiplyScalar(this.speed).negate();
        this.destination = to;

        if(this.state != ZombieState.RUN) {
            this.changeState(ZombieState.RUN);
        }

        this.setRotation(Math.PI/2-this.direction.angle());
	}

	walk(to) {
        var currentPos = this.getPosition();

        if(Math.random() > 0.5) {
            this.walkStyle = 1;
            this.speed = 0.5;
        } else {
            this.walkStyle = 2;
            this.speed = 0.15;
        }

        this.direction = currentPos.sub(to).normalize().multiplyScalar(this.speed).negate();
        this.destination = to;

        if(this.state != ZombieState.WALK) {
            this.changeState(ZombieState.WALK);
        }

        this.setRotation(Math.PI/2-this.direction.angle());

	}
	
	idle() {
		if(this.state != ZombieState.IDLE) {
			if(this.isAlive) {
				this.changeState(ZombieState.IDLE);
			}
		}
	}
	
	hit(distance) {
        
			if(this.isAlive) {
				this.changeState(ZombieState.HIT);
				this.health -= 10;
                    //(10 + Math.pow(10, 1/distance));
			}

	}

    die() {
        this.changeState(ZombieState.DIE);
    }

    attack() {
        if(this.state != ZombieState.ATTACK) {
            this.changeState(ZombieState.ATTACK);
        }
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
	
	update(delta) {
        this.ai.update(delta);

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
                        this.attackStyle = 1;
					} else {
						this.playAni("attack2");
                        this.attackStyle = 2;
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
		
        if(this.state == ZombieState.ATTACK) {
            var frame = Math.round(this.animation.getCurrentFrame());
            if((this.attackStyle == 1 && frame == 335) ||
               (this.attackStyle == 2 && frame == 375)) {
                    hitPlayer();
            }
        }
		
	}
}