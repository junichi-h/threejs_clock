import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  Object3D
} from 'three';

/**
 * @classdesc
 * 時計の時字（アワーマーク）の表示クラス
 *
 * @extends THREE.Object3D
 */
class HourMark extends Object3D{
  /**
   *
   * @param width     { number }
   * @param height    { number }
   * @param depth     { number }
   * @param color     { number }
   */
  constructor(width = 1, height = 1, depth = 1, color = 0x00ff00){
    super();
    this.geometory = new BoxGeometry(width, height, depth);
    const material = new MeshLambertMaterial({ color });
    this.cube = new Mesh(this.geometory, material);
    this.add(this.cube);
    this.position.x = 0;
    this.position.y = 0;
    this.position.z = 0;
  }

  get _geometory(){
    return this.geometory;
  }
}
export default HourMark;
