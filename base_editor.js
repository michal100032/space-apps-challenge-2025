import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const editor = document.getElementById("section3");
const scene = new THREE.Scene();

let objectBeingMoved = null;

const placeCorridorButton = document.getElementById("place-corridor-button");
placeCorridorButton.addEventListener('click', () => {
    const position = new THREE.Vector3(0, 1, 0);
    const rotation = 0;
    objectBeingMoved = new Corridor(position, rotation);
    snappingPointsShow();
});

const placeHubButton = document.getElementById("place-hub-button");
placeHubButton.addEventListener('click', () => {
    const position = new THREE.Vector3(0, 1, 0);
    objectBeingMoved = new Hub(position);
    snappingPointsShow();
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

// Place ground plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true; // enable shadow receiving
scene.add(plane);   
plane.rotation.x = -Math.PI / 2;

// Light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.position.set(0, 10, 10); // initial position
directionalLight.target.position.set(0, 0, 0); // where it points
directionalLight.castShadow = true;      // enable shadow casting
scene.add(directionalLight);
scene.add(directionalLight.target);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2 - 0.05; // radians

const CORRIDOR_LENGTH = 3;
const CORRIDOR_DIAMETER = 1;
const HUB_DIAMETER = 3;
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

class Corridor {
    constructor(position, rotation) {
        this.group = new THREE.Group();
        this.createCorridor(position, rotation);
        this.createSnapPoints(position, rotation);

        buildingBlocks.push(this);
        scene.add(this.group);
    }
    createCorridor(position, rotation) {
        const corridorMaterial = new THREE.MeshStandardMaterial({ color: 0x5555aa, flatShading: true}); 
        const corridorGeometry = new THREE.CylinderGeometry(CORRIDOR_DIAMETER / 2, CORRIDOR_DIAMETER / 2, CORRIDOR_LENGTH, 8);
        const corridorMesh = new THREE.Mesh(corridorGeometry, corridorMaterial);
        corridorMesh.castShadow = true; // enable shadow casting
        corridorMesh.receiveShadow = true; // enable shadow receiving
        
        corridorMesh.rotation.x = Math.PI / 2;
        corridorMesh.rotation.y = Math.PI / 8;
        this.group.add(corridorMesh);
        this.group.position.copy(position);
        this.group.rotation.y = rotation;
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
        const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x5555aa, flatShading: true});
        const hubGeometry = new THREE.CylinderGeometry(HUB_DIAMETER / 2, HUB_DIAMETER / 2, 1, 8);
        const hubMesh = new THREE.Mesh(hubGeometry, hubMaterial);
        hubMesh.castShadow = true; // enable shadow casting
        hubMesh.receiveShadow = true;
        hubMesh.rotation.y = Math.PI / 8;
        this.group.position.copy(position);
        this.group.add(hubMesh);
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

// Create a default hub in the scene
const hub = new Hub(new THREE.Vector3(0, 0.5, 0));

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
        if (objectBeingMoved.group.children.includes(intersects[0].object)) {
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
