"use strict";

const ZombieRoutine = {
    NONE: -1, // when dead or invisible
    STAND: 0,
    WATCH: 1,
    CHASE: 2,
    FIGHT: 3,
    PAIN: 4
};

class ZombieAI {

    constructor(zombie) {
        this.zombie = zombie;
		this.stateChange = 0;
		this.stateChangeCounter = 0;
		this.currentRoutine = ZombieRoutine.WATCH;
    }
	
	update(delta) {
        if(!this.zombie.isAlive) {
            this.currentRoutine = ZombieRoutine.NONE;
            return;
        }

        if(this.currentRoutine != ZombieRoutine.PAIN) {
            if ((this.currentRoutine != ZombieRoutine.CHASE && this.zombie.getDistanceToPlayer() < Math.random() * 300 + 100) ||
                ((this.currentRoutine == ZombieRoutine.CHASE) && this.zombie.getDistanceToPlayer() < Math.random() * 200 + 800)) {

                this.currentRoutine = ZombieRoutine.CHASE;
            } else {
                if (this.currentRoutine != ZombieRoutine.WATCH && this.currentRoutine != ZombieRoutine.STAND) {
                    if (Math.random() > 0.8) {
                        this.currentRoutine = ZombieRoutine.WATCH;
                    } else {
                        this.currentRoutine = ZombieRoutine.STAND;
                    }
                }
            }
        }

        // TODO: run away after fight - increase tolerance

		switch(this.currentRoutine) {
			case ZombieRoutine.NONE:
			    break;
			case ZombieRoutine.STAND:
				this.zombie.idle();
			    break;
			case ZombieRoutine.WATCH:
				if(this.stateChangeCounter >= this.stateChange) {
					this.stateChangeCounter = 0;					
					this.stateChange = Math.random()*50+50;
					
					if(this.zombie.getState() == ZombieState.IDLE) {
						this.zombie.walk(new THREE.Vector2(Math.random()*2000-1000, Math.random()*2000-1000));
					} else {
						this.zombie.idle();
					}
				}
			    break;
            case ZombieRoutine.CHASE:
                if (this.zombie.getDistanceToPlayer() > 70) {
                    var playerPos = getPlayerPosition();
                    this.zombie.run(new THREE.Vector2(playerPos.x, playerPos.z));
                } else {
                    this.zombie.attack();
                }

				break;
            case ZombieRoutine.PAIN:
                if(this.stateChangeCounter >= this.stateChange) {
                    this.stateChangeCounter = 0;
                    this.currentRoutine = this.lastRoutine;
                }
                break;

		}
		
		this.stateChangeCounter += 1;
	}

    gotHit(distance) {
            this.lastRoutine = this.currentRoutine;
            this.currentRoutine = ZombieRoutine.PAIN;
            this.stateChange = 100;
            this.zombie.hit(distance);
    }
    
}