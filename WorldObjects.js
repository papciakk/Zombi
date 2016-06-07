var worldObjects = [
    {
        name: "First Aid Kit",
        model: "health.dae",
        scale: 1.0,
        count: Math.random()*5 + 3,
        bonus: {
            health: 20
        }
    },

    {
        name: "Bullets",
        model: "bullets.dae",
        scale: 0.02,
        orientation: new THREE.Vector3(0, 0, -Math.PI),
        count: Math.random()*5 + 3,
        bonus: {
            ammo: 20
        }
    },

    {
        name: "Barrel",
        model: "exp_barrel.dae",
        scale: 15.0,
        count: Math.random()*5 + 3
    }
];