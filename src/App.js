import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import * as THREE from "three";
import TrackballControls from "three-trackballcontrols";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 1.0,
      y: 1.0,
      z: 1.0
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }
  componentDidMount() {
    axios
      .get(
        "http://www.astro-phys.com/api/de406/states?date=1000-1-20&bodies=mars"
      )
      .then(res => {
        console.log(res.data.results.mars);
        this.setState({
          x: res.data.results.mars[0][0],
          y: res.data.results.mars[0][1],
          z: res.data.results.mars[0][2]
        });
      });
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    const scene = new THREE.Scene();
    // let hemiLight;
    // hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    // hemiLight.color.setHSL(0.6, 1, 0.6);
    // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    // hemiLight.position.set(0, 50, 0);
    // scene.add(hemiLight);
    // let hemiLightHelper;
    // hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    // scene.add(hemiLightHelper);
    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, 50, 50);
    light.castShadow = true; // default false
    //scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.controls = new TrackballControls(camera);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const geometry = new THREE.SphereGeometry(this.state.x, 32, 32);
    scene.add(this.mesh);
    const cube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    camera.position.z = 20;
    scene.add(cube);
    renderer.setClearColor("#CEDFF0");
    renderer.setSize(1000, 1000);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.cube = cube;

    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.controls.update();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }
  render() {
    return (
      <div
        style={{ width: "400px", height: "400px" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default App;
