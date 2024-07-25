import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from '/src/getStarfield.js';
import  {getFresnelMat}  from '/src/getFresnelMat.js';

const sizes = {
    h : window.innerHeight,
    w : window.innerWidth
}
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,sizes.w/sizes.h , 0.1,1000)
// camera.position.z = 0
const renderer = new THREE.WebGLRenderer({antialias : true})
renderer.setSize(sizes.w,sizes.h)
document.body.appendChild(renderer.domElement)

const earthGroup = new THREE.Group()
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup)

const loader = new THREE.TextureLoader()
const geometry = new THREE.IcosahedronGeometry( 1,12 );
const material = new THREE.MeshStandardMaterial( { 
    map : loader.load('./textures/00_earthmap1k.jpg')
 } );
const earth = new THREE.Mesh( geometry, material );
earthGroup.add( earth );

const lightMat = new THREE.MeshBasicMaterial({
    map : loader.load('./textures/03_earthlights1k.jpg'),
    blending : THREE.AdditiveBlending
})
const lightMesh = new THREE.Mesh(geometry,lightMat)
earthGroup.add(lightMesh)


const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
  });
const cloudMesh = new THREE.Mesh(geometry,cloudMat)
cloudMesh.scale.setScalar(1.015)
earthGroup.add(cloudMesh)

const fresnelMat = getFresnelMat()
const glowMesh = new THREE.Mesh(geometry,fresnelMat)
glowMesh.scale.setScalar(1.01)
earthGroup.add(glowMesh)

const stars = getStarfield({numStars : 7000})
scene.add(stars)

const sunLight = new THREE.DirectionalLight(0xffffff,.9)
scene.add(sunLight)
sunLight.position.set(1,1,1)

camera.position.z = 3;
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
// controls.dampingFactor = 0.1
function animate() {
    requestAnimationFrame( animate );
	earth.rotation.y += 0.002;
	lightMesh.rotation.y += 0.002;
	cloudMesh.rotation.y += 0.0024;
	glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;
	// earthGroup.rotation.y += 0.002;

	renderer.render( scene, camera );
    controls.update()

}
animate()

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleWindowResize, false);