// Scene
const editor = document.getElementById("section3");
const scene = new THREE.Scene();
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;   // Important: enable shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // optional: soft shadows
editor.appendChild(renderer.domElement);

// Sphere geometry + material
const geometry = new THREE.SphereGeometry(1, 32, 32);

const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -Math.PI / 2;

// Light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(5, 10, 5); // initial position
directionalLight.target.position.set(0, 0, 0); // where it points
directionalLight.castShadow = true;      // enable shadow castingscene.add( directionalLight );
scene.add(directionalLight)
// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate sphere
    sphere.rotation.y += 0.01;

  controls.update();
    renderer.render(scene, camera);
}
animate();
