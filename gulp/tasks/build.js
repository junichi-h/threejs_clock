import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

// 静的ファイルを移動
gulp.task('extras', () => {
  gulp.src([
    'app/*.*',
    '!app/*.pug'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));

  gulp.src([
    'app/img/*.png'
  ], {
    dot: false
  }).pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['html', 'extras'], () => {
  return gulp.src('dist/**/*')
      .pipe($.size({title: 'build', gzip: true}));
});
