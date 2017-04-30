import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
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
 *
 * // todo: Container系のObject3D周りをリファクタリングすること
 */
class Clock{
  constructor(){
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById('canvas')
    });
    this.camera = null;
    this.scene = null;
    this.container = null;
    this.pivot = null;
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
    this.pivot = new Group();
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
    // this.minuteHand.position.set(0, 0.5, 0);
    this.minuteHandContainer = new Object3D();

    this.shortHand = new HourMark(0.05, 0.5, 0.05, 0x42f4d4);
    // this.shortHand.position.set(0, 0, 0);
    this.shortHandContainer = new Object3D();

    this.scene.add(this.container);
    this.container.add(this.dial);
    this.container.add(this.pivot);
    this.pivot.add(this.shortHandContainer);
    this.pivot.add(this.minuteHandContainer);
    this.pivot.add(this.secondHandContainer);
    this.container.add(this.directional);
    this.container.add(this.ambient);
    this.secondHandContainer.add(this.secondHand);
    this.shortHandContainer.add(this.shortHand);
    this.minuteHandContainer.add(this.minuteHand);
    this.secondHand.position.set(0, 0.5 * 0.5, 0);
    this.shortHandContainer.position.set(0, 0, 0);
    this.minuteHand.position.set(0, 0.5, 0);
    this.shortHand.position.set(0, 0.5 * 0.5, 0);


    this.camera.rotation.z = this.secondHandContainer.rotation.y;
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
    Object.keys(this.shortHandContainer.position).forEach((key) => {
      s.add(this.shortHandContainer.position, key, -100, 100).onChange((a) => {
        this.shortHandContainer.position[key] = a * 0.1;
      }).step(0.01);
    });
    s.open();
  }

  /**
   * 秒針をいい感じのイージングで移動。
   * アナログ時計は音なる奴いやｗ
   * @private
   */
  rotateSecond(){
    const date = new Date();
    this.secondStart = {
      angle: date.getSeconds()
    };
    this.secondEnd = {
      angle: this.secondStart.angle + 1
    };
    TweenLite.to(this.secondStart, 1, {
      angle: this.secondEnd.angle,
      ease: Linear.easeOut,
      onUpdate: () => {
        this.secondHandContainer.rotation.z = -((PI * 2) * (this.secondStart.angle / 60.0));
      },
      onComplete: () => {
        this.secondStart.angle = date.getSeconds();
        this.secondEnd.angle = this.secondStart.angle + 1;
        this.rotateSecond();
      }
    });
  }

  /**
   * 時間を元に各Objectのrotationを計算して描画
   * @public
   */
  update(){
    this.renderer.clear();
    const now = new Date();
    const hour = (now.getHours() >= 12) ? now.getHours() - 12 : now.getHours();
    const minutes = now.getMinutes();

    this.shortHandContainer.rotation.z = -30 * (PI / 180) * (hour + minutes / 60);
    this.minuteHandContainer.rotation.z = -((PI * 2) * minutes / 60);

    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height){
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
export default Clock;
