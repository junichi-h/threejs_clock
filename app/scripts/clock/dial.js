import {
  Object3D
} from 'three';

import HourMark from './hour-mark';

const NUM = 60;
const PI = Math.PI;
const RADIUS = 1.05;

class Dial extends Object3D{
  constructor(){
    super();
    this.hourMarks = [];
    const rf = PI / 180;
    const size = 0.01;
    for(let i = 0; i < NUM; i++){
      const color = 0x191919;
      const _y = (i % 5) === 0 ? 0.01 : 0.05;

      /* if(i <= 0){
        color = 0x191919;
      } else {
        color = (i % 5) === 0 ? 0x191919 : 0x191919;
      }*/
      const hourMark = new HourMark(size, _y, 0.01, color);
      this.add(hourMark);

      const degree = i * 6 + 90; // +90はデフォだと始点が(1, 0)なので時計の場合は(0, 1)にしたいのでズラす
      const rad = degree * rf;

      const x = Math.cos(rad) * RADIUS;
      const y = Math.sin(rad) * RADIUS;

      hourMark.position.set(x, y, 0);
      this.hourMarks[i] = hourMark;
    }
  }
}
export default Dial;
