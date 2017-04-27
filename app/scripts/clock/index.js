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
import Dial from './dial';
import HourMark from './hour-mark';

const RENDERER_PARAMETER = {
  color: 0x333333
};

const CAMERA_PARAMETER = {
  fovy: 120,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 10.0,
  x: 0.0,
  y: 0.0,
  z: 10.0,
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
    this.directional = null;
    this.ambient = null;
    this.dial = null;
    this.minuteHand = null; // 長針
    this.shortHand = null; // 短針
    this.secondHand = null; // 秒針
    this.secondHandContainer = null;
    this.minuteHandContainer = null;
    this.shortHandContainer = null;
  }

  init(){
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
        CAMERA_PARAMETER.fovy,
        CAMERA_PARAMETER.aspect,
        CAMERA_PARAMETER.near,
        CAMERA_PARAMETER.far
    );

    this.camera.position.x = CAMERA_PARAMETER.x;
    this.camera.position.y = CAMERA_PARAMETER.y;
    this.camera.position.z = CAMERA_PARAMETER.z;
    this.camera.lookAt(CAMERA_PARAMETER.lookAt);

    this.renderer.setClearColor(new Color(RENDERER_PARAMETER.color));
    // retina
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);

    this.directional = new DirectionalLight(0xffffff);
    this.ambient = new AmbientLight(0xffffff, 0.2);

    this.dial = new Dial();
    this.secondHand = new HourMark(0.5, 14, 1, 0xf44242);
    this.secondHand.position.x = 0;
    this.secondHand.position.y = 0;
    this.secondHand.position.z = 0;
    this.secondHandContainer = new Object3D();

    this.minuteHand = new HourMark(0.5, 13, 1, 0x000000);
    this.minuteHand.position.set(0, 0, 0);
    this.minuteHandContainer = new Object3D();

    this.shortHand = new HourMark(0.5, 9, 1, 0x000000);
    this.shortHand.position.set(0, 0, 0);
    this.shortHandContainer = new Object3D();

    this.scene.add(this.dial);
    // this.scene.add(this.secondHand);
    this.scene.add(this.shortHandContainer);
    this.scene.add(this.minuteHandContainer);
    this.scene.add(this.secondHandContainer);
    this.scene.add(this.directional);
    this.scene.add(this.ambient);
    this.shortHandContainer.add(this.shortHand);
    this.minuteHandContainer.add(this.minuteHand);
    this.secondHandContainer.add(this.secondHand);
    const now = new Date();
    const y = -((PI * 2) * (now.getSeconds() / 60.0));
    // minute.rotation.y = -((Math.PI * 2) * (now.getMinutes() / 60.0))
    // hour.rotation.y   = -((Math.PI * 2) * (now.getHours()   / 12.0))
    this.shortHandContainer.rotation.y = -((PI * 2) * (now.getHours() / 12.0));
    this.minuteHandContainer.rotation.y = -((PI * 2) * (now.getMinutes() / 60.0));
    this.secondHandContainer.rotation.y = y;
    this.camera.rotation.z = y;
    this.directional.position.set(1.0, 0, 1.0);


  }

  update(){
    this.renderer.clear();
    const now = new Date();
    const sec = now.getSeconds();
    const y = -((PI * 2) * (sec / 60));
    this.minuteHandContainer.rotation.y -= 0.0018 / 60;
    this.shortHandContainer.rotation.y -= 0.0018 / 60 / 12;
    this.secondHandContainer.rotation.z = y;
    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height){
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
export default Clock;
