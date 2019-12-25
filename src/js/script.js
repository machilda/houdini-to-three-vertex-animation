import {
    BASE_DIR
} from "../constants.yml";
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

import {
    FBXLoader
} from "three/examples/jsm/loaders/FBXLoader.js";

import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";

import vertex from "./shader/vertex.vs";
import fragment from "./shader/fragment.fs";

import {
    gsap
} from "gsap";

async function loadColTex() {
    const load = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        load.load(
            `${BASE_DIR}model/vertex_animation_textures1_col.png`,
            function (texture, textureData) {
                // memorial.exr is NPOT
                //console.log( textureData );
                //console.log( texture );
                // THREE.TextureLoader sets these default settings
                texture.generateMipmaps = false;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                const deta = {
                    texture
                };
                resolve(deta);
            }
        );
    });
}

async function loadPosTex() {
    const load = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        load.load(
            `${BASE_DIR}model/vertex_animation_textures1_pos.png`,
            function (texture) {
                // memorial.exr is NPOT
                //console.log( textureData );
                //console.log( texture );
                // EXRLoader sets these default settings
                texture.generateMipmaps = false;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                const deta = {
                    texture
                };
                resolve(deta);
            }
        );
    });
}

async function loadNormalTex() {
    const load = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        load.load(
            `${BASE_DIR}model/vertex_animation_textures1_norm.png`,
            function (texture) {
                // memorial.exr is NPOT
                //console.log( textureData );
                //console.log( texture );
                // EXRLoader sets these default settings
                texture.generateMipmaps = false;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                const deta = {
                    texture
                };
                resolve(deta);
            }
        );
    });
}

async function loadGLTF() {
    const load = new GLTFLoader();
    return new Promise((resolve, reject) => {
        load.load(`${BASE_DIR}model/output.glb`, function (object) {
            resolve(object);
        });
    });
}

async function loadFBX() {
    const load = new FBXLoader();
    return new Promise((resolve, reject) => {
        load.load(
            `${BASE_DIR}model/vertex_animation_textures1_mesh.fbx`,
            function (object) {
                resolve(object);
            }
        );
    });
}

async function init() {
    gsap.ticker.fps(24);
    let helper;
    let fps = 0;
    const colTexData = await loadColTex();
    const posTexData = await loadPosTex();
    const normalTexData = await loadNormalTex();
    const gltfData = await loadGLTF();
    // const fbxData = await loadFBX();
    const canvas = document.querySelector(".canvas");
    const border = document.querySelector(".border");

    // console.log(fbxData);

    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
        canvas
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000);

    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
    camera.position.z = 3;
    const scene = new THREE.Scene();

    // const light = new THREE.DirectionalLight(0xffffff);
    // light.position.set(1, 10, 10);
    // scene.add(light);
    renderer.render(scene, camera);
    let mesh;
    gltfData.scene.traverse(child => {
        if (child.isMesh) {
            mesh = child;
            console.log(mesh);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    colorMap: {
                        type: "t",
                        value: colTexData.texture
                    },
                    posMap: {
                        type: "t",
                        value: posTexData.texture
                    },
                    normalMap: {
                        type: "t",
                        value: normalTexData.texture
                    },
                    posMax: {
                        type: "f",
                        value: 100.0 * 0.01
                    },
                    posMin: {
                        type: "f",
                        value: -84.8048 * 0.01
                    },
                    fps: {
                        type: "f",
                        value: fps
                    }
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.DoubleSide
            });
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
        }
    });

    // var geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    // var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    // var box = new THREE.Mesh(geometry, material);
    // helper = new THREE.VertexNormalsHelper(box, 2, 0x00ff00, 1);

    // scene.add(helper);
    scene.add(gltfData.scene);
    // fbxData.scale.set(100, 100, 100)
    // scene.add(fbxData);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    function animate() {
        gsap.ticker.add(animate);
        controls.update();
        fps++;
        // fps = 1
        border.style.top = fps + 'px';

        mesh.material.uniforms.fps.value = fps;
        renderer.render(scene, camera);
        if (fps == 240) fps = 0
    }
    animate();
}
init();

function countArry(count) {
    let array = [];
    for (let i = 0; i < count; i++) {
        array.push(i);
    }
    return array;
}