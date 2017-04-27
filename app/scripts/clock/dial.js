import {
  Object3D
} from 'three';

import HourMark from './hour-mark';

const NUM = 60;
const PI = Math.PI;
const RADIUS = 15;

class Dial extends Object3D{
  constructor(){
    super();
    this.hourMarks = [];
    const rf = PI / 180;
    for(let i = 0; i < NUM; i++){
      let color = 0;
      const _y = (i % 5) === 0 ? 1.2 : 1.0;
      if(i <= 0){
        color = 0xffe500;
      } else {
        color = (i % 5) === 0 ? 0xff00ff : 0x156289;
      }

      const hourMark = new HourMark(1.0, _y, 1.0, color);
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
