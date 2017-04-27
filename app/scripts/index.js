import Stats from 'stats-js';
import Clock from './clock';

class Main{
  constructor(){
    this.stats = new Stats();
    this.clock = new Clock();
    this.timer = -1;
    this.isPlaying = true;
    this.setStats = this.setStats.bind(this);
    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * @public
   * 初期化
   */
  init(){
    this.clock.init();
    this.setStats();
    this.onResize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * statsの作成
   */
  setStats(){
    const dom = this.stats.domElement;
    dom.style.position = 'fixed';
    dom.style.top = dom.style.left = '5px';
    document.body.appendChild(dom);
  }

  /**
   * アニメーションスタートさせる
   * @public
   */
  play(){
    this.timer = window.requestAnimationFrame(this.update);
  }

  /**
   * rendererの更新
   * @private
   */
  update(){
    window.cancelAnimationFrame(this.timer);
    this.clock.update();
    if(this.isPlaying){
      this.timer = window.requestAnimationFrame(this.update);
    }
    this.stats.update();
  }

  /**
   * リサイズ
   * @private
   */
  onResize(){
    this.clock.resize(window.innerWidth, window.innerHeight);
  }

  /**
   * escキーでanimationの再生・停止を制御
   * @param event
   */
  onKeyDown(event){
    if(event.keyCode === 27){
      this.isPlaying = !this.isPlaying;
    }
    if(this.isPlaying){
      this.update();
    }
  }
}

const main = new Main();
main.init();
main.play();
