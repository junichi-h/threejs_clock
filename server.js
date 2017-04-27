import gulp from 'gulp';
import url from 'url';
import browserSync from 'browser-sync';
import './gulp/tasks/styles';
import fs from 'fs';
import pug from 'pug';
import webpack from 'webpack';
import webpackDevConfig from './webpack.config.development.babel';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
const devBundler = webpack(webpackDevConfig);

const defaultStatsOptions = {
  colors: true,
  hash: false,
  timings: false,
  chunks: false,
  chunkModules: false,
  modules: false, // reduce log
  children: true,
  version: true,
  cached: true,
  cachedAssets: true,
  reasons: true,
  source: true,
  errorDetails: true
};


const indexTmlp = fs.readFileSync('./app/index.pug');
// const index_file = fs.readFileSync('index.html', 'UTF-8');

browserSync({
  files          : [
    'app/*.pug',
    'app/images/**/*'
  ],
  notify         : false,
  port           : 9000,
  open           : false,
  reloadOnRestart: true,
  ghostMode      : {
    clicks: false,
    forms: false,
    scroll: false
  },
  server         : {
    baseDir: ['.tmp', 'app'],
    routes: {
      '/node_modules': 'node_modules'
    },
    middleware: [
      {
        route: '/',
        handle: (req, res, err) => {
          const fn = pug.renderFile('./app/index.pug');
          res.end(fn);
        }
      },
      webpackDevMiddleware(devBundler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: false,
        quiet: false,
        stats: defaultStatsOptions
      }),
      webpackHotMiddleware(devBundler),
      (req, res, next) => {
        const fileName = url.parse(req.url);
        // リロード時に404にならないようにrewrite
        /*if (/\/(compare|factor|cv|imagescale)/.test(fileName.pathname)) {
          req.url = 'index.html';
        }*/
        if(/foo|bar|home|shipping|payment|confirm|complete/.test(req.url)) {
          // res.end('index.html');
          const fn = pug.renderFile('./app/index.pug');
          res.end(fn);
        } else {
          next();
        }

        // return next();
        // /^\/\/.+/.test(req.url) ? res.end(index_file) : next();
      }
    ]
  }
});

gulp.watch('app/styles/**/*.css', ['styles']);
