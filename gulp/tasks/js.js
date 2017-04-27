import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import handleError from '../util/handleError';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.production.babel';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('js:prod', () => {
  const webpackSetting = webpack(webpackConfig);
  webpackSetting.run((err, stats) => {
    if(err){
      throw new Error('webpack build failed');
    }
    $.util.log(stats.toString({
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: true,
      chunkModules: false
    }));
    reload();
  });
});