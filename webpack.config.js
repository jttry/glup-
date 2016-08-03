//var path = require("path");
//var webpack = require('webpack');
//var node_modules_dir = path.resolve(__dirname, 'node_modules');

// process.env.NODE_ENV  product or dev

var config = {
    //devtool:false,
    // entry: {
    //     //bundle: './assets/js'
    //     list: './source/shaldapsys/sub_page/nysjcj/js/list.js'
    // },
    // output: {
    //     path: './assets/js',
    //     filename: '[name].js'
    //     path: './shaldapsys/sub_page/nysjcj/js',
    //     filename: '[name].js'
    // },
    devtool: 'inline-source-map',  
    debug: true, 
    entry: [
        './source/shaldapsys/sub_page/nysjcj/js/list.js',
        './source/shaldapsys/sub_page/nysjcj/js/storage.js'
    ],
    output: {
        path: './shaldapsys/sub_page/nysjcj/js',
        filename: 'list.js'
    },
    externals: {
        'react': 'React'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        preLoaders: [{  
          test: /\.jsx?$/,  
          exclude: /node_modules/,  
          loader: 'eslint-loader'  
        }],  
        loaders: [{
            test: /\.js$/,
            loader: 'react-hot!babel-loader'
            //loaders: ['react-hot', 'babel-loader']
        }]
    },
    //压缩 提前common文件
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['import', '$', 'export']
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        //new webpack.optimize.CommonsChunkPlugin('common.js'),
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin()
    ]
};
module.exports = config;
