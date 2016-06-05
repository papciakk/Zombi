function addSkybox(scene, folder) {
	texLoader = new THREE.TextureLoader();
	
	var imagePrefix = folder + "/";
	var directions  = ["Left", "Right", "Up", "Down", "Front", "Back"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 1000000, 1000000, 1000000 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: texLoader.load( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );
}