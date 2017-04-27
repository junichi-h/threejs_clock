import path from 'path';
import plugins from './postcss.config';


module.exports = {
  context: __dirname,

  cache: true,

  entry: [],

  target: 'web',

  output: {
    path: path.join(__dirname, '.tmp', 'scripts'),
    // devServerのパス
    publicPath: '/scripts/',
    filename: '[name].bundle.js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map'
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js)$/,
      loader: 'eslint-loader',
      exclude: /(node_modules)/,
      include: __dirname
    }, {
      test: /\.(js)$/,
      use: [
        {
          loader: "babel-loader"
        }
      ],
      exclude: /node_modules/,
      include: __dirname,
    }, {
      test: /\.(jpg|png|gif|jpeg|svg)([\?]?.*)$/,
      loader: 'url-loader',
      options: {
        limit: 100000
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            minimize: true,
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins
          }
        }
      ]
    }]
  },

  resolve:{
    descriptionFiles: ["package.json"],
    enforceExtension: false,
    modules: ['src', 'src/js', 'web_modules', 'node_modules']
  },

  plugins: []
};
