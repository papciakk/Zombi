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
    }
	
	update() {
		switch(this.currentRoutine) {
			case ZombieRoutine.NONE:
				this.zombie.resetState();
			break;
		}
	}


}