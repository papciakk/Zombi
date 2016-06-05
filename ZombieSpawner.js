"use strict";


class ZombieSpawner {

	constructor(scene) {
		var texLoader = new THREE.TextureLoader();
				
		this.zombie_diff_blue = texLoader.load("walker/meltyzombie_blue_diffuse.png");
		this.zombie_diff = texLoader.load("walker/meltyzombie_diffuse.png");
		this.zombie_spec = texLoader.load("walker/meltyzombie_spec.png");
		this.zombie_norm = texLoader.load("walker/meltyzombie_normal.png");
		this.zombie_model_filename = 'walker/walker_new.DAE';
		this.zombie_shininess = 60.0;
		
		this.scene = scene;

        this.zombies = [];
	}

	
	init() {
        var _this = this;
        return new Promise(
            function (resolve, reject) {

                var loader = new THREE.ColladaLoader();
                loader.options.convertUpAxis = true;

                loader.load(_this.zombie_model_filename, (collada) => {

                    collada.scene.traverse((child) => {
                        if (child instanceof THREE.SkinnedMesh) {
                            _this.zombie_model = child;
                        }
                    });

                    // set material params
                    _this.zombie_model.material.map = _this.zombie_diff;
                    _this.zombie_model.material.normalMap = _this.zombie_norm;
                    _this.zombie_model.material.specularMap = _this.zombie_spec;
                    _this.zombie_model.material.shininess = _this.zombie_shininess;

                    resolve();
                });
            }
        );
	}

    spawn(posx, posy) {
        if(this.zombie_model === undefined) {
            throw "Model not loaded";
        }
        var copiedZombieModel = this.zombie_model.clone();

        var animation = new THREE.Animation(copiedZombieModel, copiedZombieModel.geometry.animation);
        animation.loop = false;


        var zombie = new Zombie(copiedZombieModel, animation);
        copiedZombieModel.scale.set(6, 6, 6);
        zombie.setPosition(posx, posy);

        this.scene.add(copiedZombieModel);

        this.zombies.push(zombie);

        return zombie;
    }

    updateZombies(delta) {
        $.each(this.zombies, function(i, zombie) {
            var distance_to_player = zombie.getDistanceToPlayer();

            //zombie.setVisibled(distance_to_player < 1000);

            zombie.update(delta);
        });

    }
	
}
