import {
  AmbientLight,
  Color,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import TweenLite from 'gsap';
import Dial from './dial';
import HourMark from './hour-mark';

const RENDERER_PARAMETER = {
  color: 0x333333
};

const CAMERA_PARAMETER = {
  fovy: 60,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 60.0,
  x: 0.0,
  y: 0.0,
  z: 2.0,
  lookAt: new Vector3(0.0, 0.0, 0.0)
};

const PI = Math.PI;

/**
 * @classdesc
 * 時計の親クラス。
 * ここのクラスでは純粋にcamera scene, rendererの更新系しかしない。
 */
class Clock{
  constructor(){
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById('canvas')
    });
    this.camera = null;
    this.scene = null;
    this.container = null;
    this.directional = null;
    this.ambient = null;
    this.dial = null;
    this.minuteHand = null; // 長針
    this.shortHand = null; // 短針
    this.secondHand = null; // 秒針
    this.secondHandContainer = null;
    this.minuteHandContainer = null;
    this.shortHandContainer = null;

    this.secondStart = {
      angle: 0
    };

    this.secondEnd = {
      angle: 0
    };

    this.createGUI = this.createGUI.bind(this);
    this.rotateSecond = this.rotateSecond.bind(this);
  }

  init(){
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
        CAMERA_PARAMETER.fovy,
        CAMERA_PARAMETER.aspect,
        CAMERA_PARAMETER.near,
        CAMERA_PARAMETER.far
    );
    Object.keys(this.camera.position).forEach((key) => {
      this.camera.position[key] = CAMERA_PARAMETER[key];
    });
    this.camera.lookAt(CAMERA_PARAMETER.lookAt);

    this.renderer.setClearColor(new Color(RENDERER_PARAMETER.color));
    // retina
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);

    this.directional = new DirectionalLight(0xffffff);
    this.ambient = new AmbientLight(0xffffff, 0.2);

    this.container = new Object3D();

    this.dial = new Dial();
    this.secondHand = new HourMark(0.01, 0.5, 0.05, 0xf44242);
    this.secondHand.position.x = 0;
    this.secondHand.position.y = 0;
    this.secondHand.position.z = 0;
    this.secondHandContainer = new Object3D();
    this.secondHandContainer.position.x = 0;
    this.secondHandContainer.position.y = 0;
    this.secondHandContainer.position.z = 1;

    this.minuteHand = new HourMark(0.025, 1, 0.05, 0x00ff00);
    this.minuteHand.position.set(0, 0.5, 0);
    this.minuteHandContainer = new Object3D();

    this.shortHand = new HourMark(0.05, 0.5, 0.05, 0x42f4d4);
    this.shortHand.position.set(0, 0, 0);
    this.shortHandContainer = new Object3D();

    this.scene.add(this.container);
    this.container.add(this.dial);
    this.container.add(this.shortHandContainer);
    this.container.add(this.minuteHandContainer);
    this.container.add(this.secondHandContainer);
    this.container.add(this.directional);
    this.container.add(this.ambient);
    this.secondHandContainer.add(this.secondHand);
    this.shortHandContainer.add(this.shortHand);
    this.minuteHandContainer.add(this.minuteHand);

    this.shortHandContainer.position.set(0, -0.25, 0);

    /* const now = new Date();
    // hour
    this.shortHandContainer.rotation.y = -((PI * 2) * (now.getHours() / 12.0));
    // minutes
    this.minuteHandContainer.rotation.y = -((PI * 2) * (now.getMinutes() / 60.0));
    // seconds
    this.secondHandContainer.rotation.y = -((PI * 2) * (now.getSeconds() / 60.0));*/
    this.camera.rotation.z = this.secondHandContainer.rotation.y;
    // this.camera.lookAt(this.dial.position);
    this.directional.position.set(1.0, 0, 1.0);
    this.createGUI();
    this.rotateSecond();
  }

  /**
   * dat.GUIを作成
   */
  createGUI(){
    this.gui = new dat.GUI();
    const s = this.gui.addFolder('second');
    Object.keys(this.secondHandContainer.position).forEach((key) => {
      s.add(this.secondHandContainer.position, key, -100, 100).onChange((a) => {
        this.secondHandContainer.position[key] = a * 0.1;
      }).step(0.01);
    });
    s.open();
  }

  rotateSecond(){
    const date = new Date();
    this.secondStart = {
      angle: date.getSeconds()
    };
    this.secondEnd = {
      angle: this.secondStart.angle + 1
    };
    // this.startAngle = date.getSeconds();
    // this.endAngle = this.startAngle + 1;
    TweenLite.to(this.secondStart, 1, {
      angle: this.secondEnd.angle,
      ease: Linear.easeOut,
      onUpdate: () => {
        // -((Math.PI * 2) * (this.angle / 60.0));
        this.secondHandContainer.rotation.z = -((PI * 2) * (this.secondStart.angle / 60.0));
      },
      onComplete: () => {
        // rotation_start.angle = new Date().getSeconds();
        // rotation_end.angle   = rotation_start.angle + 1;
        this.secondStart.angle = date.getSeconds();
        this.secondEnd.angle = this.secondStart.angle + 1;
        this.rotateSecond();
      }
    });
  }

  update(){
    this.renderer.clear();

    /* const now = new Date();
    const sec = now.getSeconds();
    const y = -((PI * 2) * (sec / 60));*/
    // this.minuteHandContainer.rotation.y -= 0.0018 / 60;
    // this.shortHandContainer.rotation.y -= 0.0018 / 60 / 12;
    // this.secondHandContainer.rotation.y -= 0.0018;
    // this.camera.rotation.z -= 0.0018;
    // this.secondHandContainer.rotation.z = y;
    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height){
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
export default Clock;
