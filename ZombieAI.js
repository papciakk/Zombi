"use strict";

const ZombieRoutine = {
    NONE: -1, // when dead or invisible
    STAND: 0,
    WATCH: 1,
    CHASE: 2,
    FIGHT: 3
};

class ZombieAI {

    constructor(zombie) {
        this.zombie = zombie;
		this.stateChange = 0;
		this.stateChangeCounter = 0;
		this.currentRoutine = ZombieRoutine.CHASE;
    }
	
	update(delta) {
		switch(this.currentRoutine) {
			case ZombieRoutine.NONE:
			    break;
			case ZombieRoutine.STAND:
				this.zombie.idle();
			    break;
			case ZombieRoutine.WATCH:
				if(this.stateChangeCounter >= this.stateChange) {
					this.stateChangeCounter = 0;					
					this.stateChange = Math.random()*100+100;
					
					if(this.zombie.getState() == ZombieState.IDLE) {
						this.zombie.walk(new THREE.Vector2(Math.random()*2000-1000, Math.random()*2000-1000));
					} else {
						this.zombie.idle();
					}
				}
			    break;
            case ZombieRoutine.CHASE:
                if(this.stateChangeCounter >= this.stateChange) {
                    this.stateChangeCounter = 0;
                    this.stateChange = Math.random() * 100 + 100;

                    if (this.zombie.getDistanceToPlayer() > 100) {
                        var playerPos = getPlayerPosition();
                        this.zombie.run(new THREE.Vector2(playerPos.x, playerPos.z));
                    }
                    break;
                }
		}
		
		this.stateChangeCounter += 1;
	}


}