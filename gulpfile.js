var gulp = require("gulp");
var webpack = require("webpack");
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var webpackConfig = require('./webpack.config.js');
var livereload = require('gulp-livereload');
// var WebpackDevServer = require('webpack-dev-server');
// var md5 = require('gulp-md5-plus');
//var modRewrite = require('connect-modrewrite');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');


var SRC_DIR = 'source/shaldapsys/sub_page/nysjcj/js/list.js',
    DST_DIR = 'shaldapsys/sub_page/nysjcj/js/list.js';
// process.env.NODE_ENV  product or dev
// 打包之前清除文件里的旧文件
/*gulp.task('clean', function() {
    return gulp.src('assets/js/bundle.js', {
        read: false
    })
    .pipe(clean());
});*/

gulp.task('clean', function() {
    return gulp.src(DST_DIR, {
        read: false
    })
    .pipe(clean());
});

// 语法检查
gulp.task('jshint', function () {
    return gulp.src(SRC_DIR)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//执行webpack
gulp.task('webpack', function() {
    webpack(webpackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", 'webpack is  OK!');
        //gulp.start(['addmd5']);   //开发环境不加MD5，因为watch 监控，MD5实时打包就出错误！
    })
});

//启动服务器
gulp.task("connect", function() {
    connect.server({
        port: 800,
        livereload: true
    });
});

//监控文件
/*gulp.task("watch", function() {
	livereload.listen();
    gulp.watch('assets/js/*.js', ['webpack']).on('change', livereload.changed);
});*/

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch(SRC_DIR, ['jshint','webpack'])/*.on('change', livereload.changed)*/;
});


gulp.task('default', ['clean', 'jshint', 'webpack'], function() {
    gulp.start(['watch']);
});






