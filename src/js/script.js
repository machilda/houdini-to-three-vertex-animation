import {
    BASE_DIR
} from "../constants.yml";
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";

import vertex from "./shader/vertex.vs";
import fragment from "./shader/fragment.fs";

import {
    gsap
} from "gsap";


async function loadTexture(url) {
    const load = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        load.load(
            `${BASE_DIR}model/${url}`,
            function (texture) {
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

async function loadConfigJson(url) {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_DIR}model/${url}`)
            .then(function (response) {
                resolve(response.json())
            })
    });
}

async function loadGLTF(url) {
    const load = new GLTFLoader();
    return new Promise((resolve, reject) => {
        load.load(`${BASE_DIR}model/${url}`, function (object) {
            resolve(object);
        });
    });
}

const directory = 'cloth';

async function init() {
    gsap.ticker.fps(24);
    let fps = 0;
    const json = await loadConfigJson(`${directory}/vertex_animation_textures1_data.json`);
    const jsonData = json[0]

    const colTexData = await loadTexture(`${directory}/vertex_animation_textures1_col.png`);
    const posTexData = await loadTexture(`${directory}/vertex_animation_textures1_pos.png`);
    const gltfData = await loadGLTF(`${directory}/output.glb`);

    const canvas = document.querySelector(".canvas");
    const border = document.querySelector(".border");


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

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 10, 10);
    scene.add(light);
    renderer.render(scene, camera);
    let mesh;
    gltfData.scene.traverse(child => {
        if (child.isMesh) {
            mesh = child;
            console.log(mesh);
            const material = new THREE.ShaderMaterial({
                wireframe: false,
                uniforms: {
                    colorMap: {
                        type: "t",
                        value: colTexData.texture
                    },
                    posMap: {
                        type: "t",
                        value: posTexData.texture
                    },
                    //ここは頂点数 -1 の値を入れる
                    totalNum: {
                        type: "f",
                        value: 3599.0
                    },
                    totalFrame: {
                        type: "f",
                        value: jsonData.numOfFrames
                    },
                    posMax: {
                        type: "f",
                        value: jsonData.posMax * 0.01
                    },
                    posMin: {
                        type: "f",
                        value: jsonData.posMin * 0.01
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

    scene.add(gltfData.scene);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    function animate() {
        gsap.ticker.add(animate);
        controls.update();
        fps++;
        border.style.top = fps + 'px';

        mesh.material.uniforms.fps.value = fps;
        renderer.render(scene, camera);
        console.log(fps, jsonData.numOfFrames);

        if (fps == jsonData.numOfFrames) fps = 0
    }
    animate();
}
init();