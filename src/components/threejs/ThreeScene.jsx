// import * as THREE from "../build/three.module.js";
// import { OrbitControls } from "../jsm/controls/OrbitControls.js";
// import { AudioLoader } from "../jsm/loaders/AudioLoader.js";
// import { ConvolutionEffect } from "../jsm/misc/ConvolutionShader.js";
// import { Reflector } from "../jsm/objects/Reflector.js";
// import { GUI } from "../jsm/libs/dat.gui.module.js";

// let container, controls;
// let camera, scene, renderer;
// let audio, audioLoader;
// let audioListener, audioAnalyser;
// let audioData, audioBuffer;
// let sphere;
// let audioContext, audioConvolver;

// const raycaster = new THREE.Raycaster();
// const pointer = new THREE.Vector2();

// const objects = [];

// const mouse = new THREE.Vector2();

// const INTERSECTED = [];

// init();
// animate();

// function init() {
//   container = document.createElement("div");
//   document.body.appendChild(container);

//   camera = new THREE.PerspectiveCamera(
//     60,
//     window.innerWidth / window.innerHeight,
//     1,
//     10000
//   );
//   camera.position.set(0, 20, 40);

//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xa0a0a0);
//   scene.fog = new THREE.Fog(0xa0a0a0, 20, 100);

//   // ground

//   const ground = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(100, 100),
//     new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
//   );
//   ground.rotation.x = -Math.PI / 2;
//   ground.receiveShadow = true;
//   scene.add(ground);

//   // boxes

//   const boxGeometry = new THREE.BoxBufferGeometry(4, 4, 4);

//   for (let i = 0; i < 10; i++) {
//     const boxMaterial = new THREE.MeshPhongMaterial({
//       color: Math.random() * 0xffffff,
//     });
//     const box = new THREE.Mesh(boxGeometry, boxMaterial);

//     box.position.x = Math.random() * 20 - 10;
//     box.position.y = Math.random() * 10;
//     box.position.z = Math.random() * 20 - 10;

//     box.castShadow = true;
//     box.receiveShadow = true;

//     scene.add(box);
//     objects.push(box);
//   }

//   // sphere

//   const sphereGeometry = new THREE.IcosahedronBufferGeometry(20, 1);
//   const sphereMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     envMap: scene.background,
//   });

//   sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//   sphere.position.y = 50;
//   sphere.visible = false;

//   scene.add(sphere);

//   // lights
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
//   scene.add(ambientLight);

//   const dirLight = new THREE.DirectionalLight(0xffffff, 1);
//   dirLight.position.set(5, 5, 5);
//   scene.add(dirLight);

//   // audio
//   const listener = new THREE.AudioListener();
//   camera.add(listener);

//   const audioLoader = new THREE.AudioLoader();
//   const audio = new THREE.Audio(listener);

//   audioLoader.load("sounds/376737_j_s_song.ogg", function (buffer) {
//     audio.setBuffer(buffer);
//     audio.setLoop(true);
//     audio.setVolume(0.5);
//     audio.play();
//   });

//   // cubes
//   const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//   const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });

//   for (let i = 0; i < 10; i++) {
//     const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//     cube.position.set(
//       Math.random() * 10 - 5,
//       Math.random() * 10 - 5,
//       Math.random() * 10 - 5
//     );
//     scene.add(cube);
//   }

//   // renderer
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);

//   // resize handling
//   window.addEventListener("resize", () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });

//   // clock
//   const clock = new THREE.Clock();

//   // render loop
//   (function render() {
//     requestAnimationFrame(render);

//     // update controls
//     controls.update(clock.getDelta());

//     // render scene
//     renderer.render(scene, camera);
//   })();
// }
