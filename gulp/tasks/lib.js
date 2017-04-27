import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import { lang } from '../lang-setting.json';

const root = './node_modules/';
const libs = [
    // `${root}stats-js/build/stats.min.js`,
    `${root}dat.gui/build/dat.gui.min.js`,
    // `${root}pixi.js/dist/pixi.min.js`,
    `${root}three/build/three.min.js`,
  /*`${root}three/examples/js/shaders/CopyShader.js`,
    `${root}three/examples/js/shaders/FXAAShader.js`,
    `${root}three/examples/js/postprocessing/EffectComposer.js`,
    `${root}three/examples/js/postprocessing/RenderPass.js`,
    `${root}three/examples/js/postprocessing/ShaderPass.js`,*/
    `${root}three/examples/js/loaders/MTLLoader.js`,
    `${root}three/examples/js/loaders/OBJLoader.js`
];


/**
 *
 * @param isPro {boolean}
 * @param lang { string }
 */
const makeLib = function(isPro, lang) {
  // const dist = isPro ? `dist/${lang}/scripts` : `.tmp/${lang}/scripts`;
  let dist = `.tmp/${lang}/scripts`;
  if(isPro) {
    if(lang === 'ja') {
      dist = 'dist/jpn/events/mobilmo/scripts';
    } else if(lang === 'en') {
      dist = 'dist/events/mobilmo/scripts';
    }
  }
  return gulp.src(libs)
      .pipe(uglify({preserveComments: 'some'}))
      .pipe(concat('webgl.js'))
      .pipe(gulp.dest(dist))
};

gulp.task('lib', () => {
  lang.forEach((l) => {
    makeLib(false, l);
  })
});

gulp.task('lib:prod', () => {
  lang.forEach((l) => {
    makeLib(true, l);
  })
});