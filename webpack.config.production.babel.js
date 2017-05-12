import webpack from 'webpack';
import glob from 'glob'
import baseConfig from './webpack.config.base';

const _entry = {
  index: [
    './app/scripts/index.js'
  ]
};

const config = Object.create(baseConfig);
config.entry = _entry;

config.stats = {
  assets: true,
  cached: false,
  cachedAssets: false,
  children: false,
  chunks: false,
  chunkModules: false,
  chunkOrigins: false,
  chunksSort: 'field',
  colors: true,
  hash: false,
  // 不要なchunkモジュールのログを消している
  maxModules: 0,
  // これだと消えない・・bug?
  modules: false,
  performance: true,
  publicPath: false
};

// 本番のみminifyする
if(process.env.NODE_ENV === 'production'){
  config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({ // Uglify
        mangle: true, // ローカル変数名を短い名称に変更する
        sourcemap: false,
        compress: {
          unused: false,
          conditionals: false,
          dead_code: false,
          side_effects: false
        }
      })
  );
}

config.plugins.push(
    new webpack.ProgressPlugin((percentage, msg) => {
      process.stdout.write('progress ' + Math.floor(percentage * 100) + '% ' + msg + '\r');
    })
);

export default config;