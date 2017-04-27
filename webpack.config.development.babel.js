import baseConfig from './webpack.config.base';
import webpack from 'webpack';

const _entry = {
  index: [
    './app/scripts/index.js',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
  ]
};

const config = Object.create(baseConfig);
config.entry = _entry;

config.devtool = '#source-map';
config.plugins.push(
    new webpack.LoaderOptionsPlugin({ debug: true })
);
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development')
}));

module.exports = config;
