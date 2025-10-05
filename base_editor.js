import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const editor = document.getElementById("section3");
const scene = new THREE.Scene();

let objectBeingMoved = null;

let corridorModel = null;
let hubModel = null;
let pvModel = null;

// Load models
const loader = new GLTFLoader();
loader.load('models/corridor.glb', (gltf) => {
    corridorModel = gltf.scene;
    corridorModel.children.forEach(child => {
        child.castShadow = true; // enable shadow casting for each child
        child.receiveShadow = true; // enable shadow receiving for each child
        child.material = new THREE.MeshStandardMaterial({ color: 0x5555aa, flatShading: true});
    });
}, undefined, (error) => {
    console.error('Error loading corridor model:', error);
});

loader.load('models/hub.glb', (gltf) => {
    hubModel = gltf.scene;
    hubModel.children.forEach(child => {
        child.castShadow = true; // enable shadow casting for each child
        child.receiveShadow = true; // enable shadow receiving for each child
        child.material = new THREE.MeshStandardMaterial({ color: 0x5555aa, flatShading: true});
    });
    // Create a default hub in the scene
    new Hub(new THREE.Vector3(0, 0.5, 0));
}, undefined, (error) => {
    console.error('Error loading hub model:', error);
});

loader.load('models/terrain.glb', (gltf) => {
    let terrainModel = gltf.scene;
    terrainModel.children.forEach(child => {
        child.castShadow = true; // enable shadow casting for each child
        child.receiveShadow = true; // enable shadow receiving for each child
        child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    });
    // Create a default terrain in the scene
    scene.add(terrainModel);
}, undefined, (error) => {
    console.error('Error loading terrain model:', error);
});

loader.load('models/pv.glb', (gltf) => {
    pvModel = gltf.scene;
    pvModel.children.forEach(child => {
        child.castShadow = true; // enable shadow casting for each child
        child.receiveShadow = true; // enable shadow receiving for each child
        child.material = new THREE.MeshStandardMaterial({ color: 0x5555aa, flatShading: true});
    });
}, undefined, (error) => {
    console.error('Error loading terrain model:', error);
});

const placeCorridorButton = document.getElementById("place-corridor-button");
placeCorridorButton.addEventListener('click', () => {
    const position = new THREE.Vector3(0, -10, 0);
    const rotation = 0;
    objectBeingMoved = new Corridor(position, rotation);
    snappingPointsShow();
});

const placeHubButton = document.getElementById("place-hub-button");
placeHubButton.addEventListener('click', () => {
    const position = new THREE.Vector3(0, -10, 0);
    objectBeingMoved = new Hub(position);
    snappingPointsShow();
});

const placePVModuleButton = document.getElementById("place-pv-module");
placePVModuleButton.addEventListener('click', () => {
    const position = new THREE.Vector3(0, -10, 0);
    objectBeingMoved = new PVModule(position, 0);
});

// Camera
const camera = new THREE.PerspectiveCamera(75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;   // Important: enable shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // optional: soft shadows
editor.appendChild(renderer.domElement);

// Light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.position.set(-20, 10, -5); // initial position
directionalLight.target.position.set(0, 0, 0); // where it points
directionalLight.castShadow = true;      // enable shadow casting
scene.add(directionalLight);
scene.add(directionalLight.target);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2 - 0.05; // radians

const CORRIDOR_LENGTH = 3.25;
const CORRIDOR_DIAMETER = 1;
const HUB_DIAMETER = 3.55;
const MINIMUM_SNAP_DISTANCE = 1;


const buildingBlocks = [];

function snappingPointsHide() {
    buildingBlocks.forEach(block => {
        block.snapPointGroup.visible = false;
    });
}

function snappingPointsShow() {
    buildingBlocks.forEach(block => {
        block.snapPointGroup.visible = true;
    });
}

class PVModule {
    constructor(position, rotation) {
        this.group = new THREE.Group();
        this.createPVModule(position, rotation);
        scene.add(this.group);
        this.snapPointPositions = []; // PV modules have no snap points
    }
    createPVModule(position, rotation) {
        if (!pvModel) return;
        this.model = pvModel.clone();
        this.model.position.set(0, 0, 0);
        this.model.rotation.set(Math.PI / 2, 0, 0);
        this.group.position.copy(position);
        this.group.rotation.y = rotation;
        this.group.add(this.model);
    }

    setPosition(position) {
        this.group.position.copy(position);
    }
}

class Corridor {
    constructor(position, rotation) {
        this.group = new THREE.Group();
        this.createCorridor(position, rotation);
        this.createSnapPoints(position, rotation);

        buildingBlocks.push(this);
        scene.add(this.group);
    }
    createCorridor(position, rotation) {
        if (corridorModel) {
            this.model = corridorModel.clone();
            this.model.position.set(0, 0, 0);
            this.model.rotation.set(Math.PI / 2, 0, 0);
            this.group.add(this.model);
            this.group.position.copy(position);
            this.group.rotation.y = rotation;
        }
    }
    createSnapPoints(position, rotation) {
        const snapPointGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const snapPointMaterial = new THREE.MeshBasicMaterial({ color: 0x888800 });

        this.snapPointGroup = new THREE.Group();
        // Start snap point
        const startSnapPoint = new THREE.Mesh(snapPointGeometry, snapPointMaterial);
        const startSnapPointOffset = new THREE.Vector3(0, 0, -CORRIDOR_LENGTH / 2);

        startSnapPointOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        startSnapPoint.position.copy(startSnapPointOffset);
        this.snapPointGroup.add(startSnapPoint);

        // End snap point
        const endSnapPoint = new THREE.Mesh(snapPointGeometry, snapPointMaterial);
        const endSnapPointOffset = new THREE.Vector3(0, 0, CORRIDOR_LENGTH / 2);

        endSnapPointOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        endSnapPoint.position.copy(endSnapPointOffset);
        this.snapPointGroup.add(endSnapPoint);

        this.group.add(this.snapPointGroup);

        this.snapPointPositions = [
            startSnapPoint.position.clone().add(position),
            endSnapPoint.position.clone().add(position)
        ];
    }
    setPosition(position) {
        this.group.position.copy(position);
        const startSnapPointOffset = new THREE.Vector3(0, 0, -CORRIDOR_LENGTH / 2);
        const endSnapPointOffset = new THREE.Vector3(0, 0, CORRIDOR_LENGTH / 2);

        startSnapPointOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.group.rotation.y);
        endSnapPointOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.group.rotation.y);

        this.snapPointPositions[0].copy(startSnapPointOffset).add(position);
        this.snapPointPositions[1].copy(endSnapPointOffset).add(position);
    }
}

class Hub {
    constructor(position) {
        this.group = new THREE.Group();
        this.createHub(position);
        this.createSnapPoints(position);
        scene.add(this.group);
        buildingBlocks.push(this);
    }
    createHub(position) {
        if (hubModel) {
            this.model = hubModel.clone();
            this.model.position.set(0, 0, 0);
            this.model.rotation.set(Math.PI / 2, 0, 0);
            this.group.add(this.model);
            this.group.position.copy(position);
        }
    }

    createSnapPoints(position) {
        const snapPointGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const snapPointMaterial = new THREE.MeshBasicMaterial({ color: 0x888800 });

        const directions = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
        ];

        this.snapPointPositions = [];

        this.snapPointGroup = new THREE.Group();
        this.group.add(this.snapPointGroup);

        directions.forEach(dir => {
            const snapPoint = new THREE.Mesh(snapPointGeometry, snapPointMaterial);
            this.snapPointPositions.push(position.clone().add(dir.clone().multiplyScalar(HUB_DIAMETER / 2)));
            snapPoint.position.copy(dir.multiplyScalar(HUB_DIAMETER / 2));
            this.snapPointGroup.add(snapPoint);
        });
    }
    setPosition(position) {
        this.group.position.copy(position);
        const directions = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
        ];
        this.snapPointPositions.forEach((snapPos, index) => {
            snapPos.copy(directions[index].multiplyScalar(HUB_DIAMETER / 2)).add(position);
        });
    }
}

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const hoverSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(hoverSphere);
hoverSphere.visible = false;

renderer.domElement.addEventListener('mousemove', (event) => {
    if (!objectBeingMoved) return;
    // convert mouse position to 3d space with raycaster
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        let intersect;
        // check if the intersected object is not the hoverSphere itself
        if (objectBeingMoved.model.children.includes(intersects[0].object)) {
            if (intersects.length > 1) {
                intersect = intersects[1];
            } else {
                hoverSphere.visible = false;
                return;
            }
        } else {
            intersect = intersects[0];
        }
        objectBeingMoved.setPosition(intersect.point);

        let closestSnapPoint = null;
        let closestDistance = Infinity;
        let objectBeingMovedSnappedPoint = null;

        objectBeingMoved.snapPointPositions.forEach(snapPos => {
            buildingBlocks.forEach(block => {
                if (block === objectBeingMoved) return; // skip self
                block.snapPointPositions.forEach(otherSnapPos => {
                    const distance = snapPos.distanceTo(otherSnapPos);
                    if (distance < closestDistance && distance < MINIMUM_SNAP_DISTANCE) {
                        closestDistance = distance;
                        closestSnapPoint = otherSnapPos;
                        objectBeingMovedSnappedPoint = snapPos;
                    }
                });
            });
        });
        if (!closestSnapPoint) {
            objectBeingMoved.setPosition(intersect.point.clone().add(new THREE.Vector3(0, 0.5, 0)));
        } else {
            objectBeingMoved.setPosition(objectBeingMoved.group.position.clone().sub(objectBeingMovedSnappedPoint).add(closestSnapPoint));
        }

    }
});

window.addEventListener('keydown', (event) => {
    if (!objectBeingMoved) return;
    if (event.key === 'r' || event.key === 'R') {
        objectBeingMoved.group.rotation.y += Math.PI / 2;
        objectBeingMoved.setPosition(objectBeingMoved.group.position);
    }
});

renderer.domElement.addEventListener('click', (event) => {
    if (!objectBeingMoved) return;

    objectBeingMoved = null;
    snappingPointsHide();
});

camera.position.set(0, 5, 10);  // (x, y, z)

// Animation loop
function animate() {
    requestAnimationFrame(animate);

  controls.update();
    renderer.render(scene, camera);
}
animate();
