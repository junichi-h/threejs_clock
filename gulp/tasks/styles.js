// postcss
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import short from 'postcss-short';
import cssforloop from 'postcss-for';
import cssrandom from 'postcss-random';
import _import from 'postcss-easy-import';
import stylelint from 'stylelint';
import assets from 'postcss-assets';
import reporter from 'postcss-reporter';
import browserSync from 'browser-sync';
import doiuse from 'doiuse';
import sprites, { updateRule } from 'postcss-sprites';
import path from 'path';

const $ = gulpLoadPlugins();
const reload = browserSync.stream;

const browsers = [
  'ie >= 11',
  'ff >= 48',
  'chrome >= 54',
  'safari >= 9',
  'ios >= 8',
  'android >= 4.4',
  'ChromeAndroid >= 52'
];

const processors = [
  _import({
    path: ['node_modules'],
    glob: true
  }),
  short,
  cssforloop,
  cssrandom,
  cssnext({browsers}),
  assets({
    basePath: 'app/',
    loadPaths: ['assets/img/'],
    relativeTo: 'app'
  }),
  sprites({
    stylesheetPath: 'app/styles/', //出力するcssのパス
    spritePath: 'app/assets/img',   //スプライト画像を出力する先のパス
    basePath: 'app/',  // urlのベースパス
    relativeTo: 'app',
    retina: true,
    // img/spritesのみスプライトの対象とする
    filterBy(image){
      if(/img\/sprites/.test(image.url)){
        return Promise.resolve();
      }
      return Promise.reject();
    },
    groupBy: function(image) {
      if (image.url.indexOf('@2x') === -1) {
        return Promise.resolve('@1x');
      }
      return Promise.resolve('@2x');
    },
    spritesmith: {
      padding: 10
    },
    hooks: {
      // 出力されるスプライト画像ファイル名を変更する sprite@2xだと同じファイルが量産されるので
      onSaveSpritesheet: function(opts, data) {
        if(data.groups[0] === '@1x'){
          // 通常サイズのスプライト
          return path.join(opts.spritePath, '_sprites.png');
        }else{
          // retinaサイズのスプライト
          return path.join(opts.spritePath, '_sprites@2x.png');
        }
      }
    }
  }),
  reporter({ clearMessages: true })
];

gulp.task('stylelint', () => {
  return gulp.src('app/styles/**/*.css')
      .pipe($.plumber())
      .pipe(postcss([
        stylelint,
        doiuse({
          browsers,
          ignore: ['flexbox', 'css-appearance', 'css-media-resolution'],
          ignoreFiles: ['**/node_modules/**/*.css', '**/_sprite.css']
        }),
        reporter({ clearMessages: true })
      ]))
});

const targetCSS = ['app/styles/**/main*.css', 'app/styles/**/faq*.css'];

gulp.task('styles', ['stylelint'], () => {
  return gulp.src(targetCSS)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe(postcss(processors))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('.tmp/styles'))
      .pipe(reload({match: "**/*.css"}));
});

gulp.task('styles:prod', ['stylelint'], () => {
  return gulp.src(targetCSS)
      .pipe($.plumber())
      .pipe(postcss(processors))
      .pipe(gulp.dest('.tmp/styles'))
});
