var gulp = require('gulp');

// 引入组件
var less = require('gulp-less'),            // less
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'),        // js压缩
    concat = require('gulp-concat'),        // 合并文件
    rename = require('gulp-rename'),        // 重命名
    clean = require('gulp-clean');          //清空文件夹

// less解析
gulp.task('build-less', function(){
  gulp.src('./javis/static/less/lib/s-production.less')
    .pipe(less())
    .pipe(gulp.dest('./javis/static/build/css/lib/'))

  gulp.src('./javis/static/less/lib/s-skins.less')
    .pipe(less())
    .pipe(gulp.dest('./javis/static/build/css/lib/'))

  gulp.src('./javis/static/less/lib/s/s.less')
    .pipe(less())
    .pipe(gulp.dest('./javis/static/build/css/lib/'))

  gulp.src('./javis/static/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./javis/static/build/css/'))
});

// 合并、压缩、重命名css
gulp.task('stylesheets',['build-less'], function() {
    // 注意这里通过数组的方式写入两个地址,仔细看第一个地址是css目录下的全部css文件,第二个地址是css目录下的areaMap.css文件,但是它前面加了!,这个和.gitignore的写法类似,就是排除掉这个文件.
  gulp.src(['./javis/static/build/css/*.css','!./javis/static/build/css/areaMap.css'])
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./javis/static/build/css/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./javis/static/build/css'));
});

// 合并，压缩js文件
gulp.task('javascripts', function() {
  gulp.src('./javis/static/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./javis/static/build/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./javis/static/build/js'));
});

// 清空图片、样式、js
gulp.task('clean', function() {
  return gulp.src(['./javis/static/build/css/all.css','./javis/static/build/css/all.min.css'], {read: false})
    .pipe(clean({force: true}));
});

// 将bower的库文件对应到指定位置
gulp.task('buildlib',function(){

  gulp.src('./bower_components/angular/angular.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular/angular.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-route/angular-route.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-animate/angular-animate.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-bootstrap/ui-bootstrap.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  //--------------------------css-------------------------------------

  gulp.src('./javis/static/less/fonts/*')
      .pipe(gulp.dest('./javis/static/build/css/fonts/'))

  gulp.src('./bower_components/bootstrap/fonts/*')
      .pipe(gulp.dest('./javis/static/build/css/fonts/'))

  gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('./javis/static/build/css/lib'))

});

// 定义develop任务在日常开发中使用
gulp.task('develop',function(){
  gulp.run('buildlib','build-less','javascripts','stylesheets');

  gulp.watch('./javis/static/less/*.less', ['build-less']);
});

// 定义一个prod任务作为发布或者运行时使用
gulp.task('prod',function(){
  gulp.run('buildlib','build-less','stylesheets','javascripts');

  // 监听.less文件,一旦有变化,立刻调用build-less任务执行
  gulp.watch('./javis/static/less/*.less', ['build-less']);
});

// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
gulp.task('default',['clean'], function() {
  gulp.run('develop');
});









var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并文件之后压缩代码
gulp.task('minify', function (){
     return gulp.src('src/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['jshint', 'minify']);
});

// 注册缺省任务
gulp.task('default', ['jshint', 'minify', 'watch']);










var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify')
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var revCollector = require('gulp-rev-collector');
var browserSync = require('browser-sync').create();
var gulpSequence = require('gulp-sequence');
var uncss = require('gulp-uncss');
var htmlmin = require('gulp-htmlmin');
var base64 = require('gulp-base64');
var changed = require('gulp-changed');
var postcss = require("gulp-postcss");
var sprites = require('postcss-sprites').default;
var autoprefixer = require('autoprefixer');
var cssgrace = require('cssgrace');

var SRC_DIR = './src/';
var PKG_DIR = './tmp/pkg/';
var REV_DIR = './tmp/rev/';
var DST_DIR = './dist/';
var UNCSS_REG = [/.advise/, /.block/, /.g-bd .m-view-2 .category li:nth-child/, /^.g-bd ul li .info/, /.hljs/];

gulp.task('clean', function() {
    return del(['dist', 'tmp']);
});

/*
 * 合并请求
 * <!-- build:css ../css/index.pkg.css --><!-- endbuild -->
 * <!-- build:js ../js/index.pkg.js --><!-- endbuild -->
 */
gulp.task('pkg', function() {
    return gulp.src(SRC_DIR + 'view/*.html')
        .pipe(useref())
        .pipe(gulp.dest(PKG_DIR + 'view/'));
});

/*
 * 移动非jpg/png资源到img文件夹
 * 
 */
gulp.task('move-img-other', function() {
    return gulp.src([SRC_DIR + 'img/**/*.*!(jpg|png)', SRC_DIR + 'component/img/**/*.*!(jpg|png)'])
        .pipe(gulp.dest('./tmp/pkg/img/'));
});

/*
 * 压缩IMG
 * 
 */
gulp.task('min-img', function() {
    return gulp.src([SRC_DIR + 'img/**/*.*(jpg|png)', SRC_DIR + 'component/img/**/*.*(jpg|png)'])
        .pipe(imagemin())
        .pipe(gulp.dest('./tmp/pkg/img/'));
});

/*
 * 压缩CSS(PC)
 * 
 */
gulp.task("min-css-pc", function() {
    // PostCSS
    var processors = [
        sprites({
            'stylesheetPath': PKG_DIR + 'css/',
            'spritePath': PKG_DIR + 'img/'
        }),
        autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'ie 6-11']
        }),
        cssgrace
    ];
    return gulp.src([PKG_DIR + 'css/**/*.css'])
        .pipe(uncss({
            html: [PKG_DIR + '**/*.html'],
            ignore: UNCSS_REG
        })).pipe(nano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(PKG_DIR + 'css/'))
});

/*
 * 压缩CSS(Mobile)
 * 
 */
gulp.task("min-css-mobile", function() {
    // PostCSS
    var processors = [
        autoprefixer({
            browsers: ['> 1%', 'last 2 versions']
        })
    ];
    return gulp.src([PKG_DIR + 'css/**/*.css'])
        .pipe(uncss({
            html: [PKG_DIR + '**/*.html'],
            ignore: UNCSS_REG
        })).pipe(nano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(PKG_DIR + 'css/'))
});

/*
 * 压缩JS
 * 
 */
gulp.task('min-js', function() {
    return gulp.src(PKG_DIR + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(PKG_DIR + 'js/'));
});

/*
 * 版本化IMG
 * 
 */
gulp.task('rev-img', function() {
    return gulp.src(PKG_DIR + 'img/**/*')
        .pipe(rev())
        .pipe(gulp.dest(REV_DIR + 'img/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(REV_DIR + 'img/'));
});

/*
 * 版本化CSS
 * 
 */
gulp.task('rev-css', function() {
    return gulp.src(PKG_DIR + 'css/**/*')
        .pipe(rev())
        .pipe(gulp.dest(REV_DIR + 'css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(REV_DIR + 'css/'));
});

/*
 * 版本化JS
 * 
 */
gulp.task('rev-js', function() {
    return gulp.src(PKG_DIR + 'js/**/*')
        .pipe(rev())
        .pipe(gulp.dest(REV_DIR + 'js/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(REV_DIR + 'js/'));
});

/*
 * 收集图片到CSS
 */
gulp.task('col-css', function() {
    return gulp.src([REV_DIR + 'img/*.json', REV_DIR + 'css/*.css'])
        .pipe(revCollector())
        .pipe(gulp.dest(DST_DIR + 'css/'));
});

/*
 * 移动IMG文件到目标文件夹
 */
gulp.task('col-img', function() {
    return gulp.src([REV_DIR + 'img/*', '!' + REV_DIR + '/img/*.json'])
        .pipe(gulp.dest(DST_DIR + 'img/'));
});

/*
 * 移动JS文件到目标文件夹
 */
gulp.task('col-js', function() {
    return gulp.src(REV_DIR + 'js/*.js')
        .pipe(gulp.dest(DST_DIR + 'js/'));
});

/*
 * 收集资源到HTML
 */
gulp.task('col-html', function() {
    return gulp.src([REV_DIR + '**/*.json', PKG_DIR + 'view/*.html'])
        .pipe(revCollector())
        .pipe(htmlmin({
            // collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(DST_DIR + 'view/'));
});

/*
 * 移动mock文件夹
 */
gulp.task('move-mock', function() {
    return gulp.src(SRC_DIR + 'mock/**/*')
        .pipe(gulp.dest(DST_DIR + 'mock/'));
});

/*
 * 图片base64
 */
gulp.task('base64', function() {
    return gulp.src(PKG_DIR + '/**/*.css')
        .pipe(base64({
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
        }))
        .pipe(gulp.dest(PKG_DIR));
});


/*
 * 静态服务器
 */
gulp.task('bs', function() {
    browserSync.init({
        files: "**", //监听整个项目
        open: "external",
        server: {
            baseDir: "./dist/",
            index: 'view/index.html'
        }
    });
});

/*
 * 静态服务器(代理)
 */
gulp.task('bsp', function() {
    browserSync.init({
        proxy: "127.0.0.1"
    });
});

/*
 * PC打包方案
 */
gulp.task('pc', gulpSequence(
    'clean', 'pkg', 'min-img', 
    ['min-img', 'min-css-pc', 'min-js'], 'move-img-other', 
    ['rev-img', 'rev-css', 'rev-js'], 
    ['col-img', 'col-css', 'col-js', 'col-html'],
    'move-mock', 'bs'
));

/*
 * Mobile打包方案
 */
gulp.task('mobile', gulpSequence(
    'clean', 'pkg', 'min-img', 'base64', 'move-img-other',
    ['min-img', 'min-css-mobile', 'min-js'], 
    ['rev-img', 'rev-css', 'rev-js'], 
    ['col-img', 'col-css', 'col-js', 'col-html'],
    'move-mock', 'bs'
));


gulp.task('default', ['mobile'], function() {
    return del(['tmp/']);
});













/*jshint node: true*/

//引入gulp及各种组件;

var gulp = require('gulp'),

    uglify = require('gulp-uglify'),

    minifyCSS = require('gulp-minify-css'),

    sass = require('gulp-sass'),

    imagemin = require('gulp-imagemin'),

    imageminJpegRecompress = require('imagemin-jpeg-recompress'),

    imageminOptipng = require('imagemin-optipng'),

    browserSync = require('browser-sync').create();


//设置各种输入输出文件夹的位置;

var srcScript = '../src/js/*.js',

    dstScript = '../dist/js',

    srcCss = '../src/css/*.css',

    dstCSS = '../dist/css',

    srcSass = '../src/css/*.scss',

    dstSass = '../dist/css',

    srcImage = '../src/img/*.*',

    dstImage = '../dist/img',

    srcHtml = '../src/*.html',

    dstHtml = '../dist';


//处理JS文件:压缩,然后换个名输出;

//命令行使用gulp script启用此任务;

gulp.task('script', function() {

    gulp.src(srcScript)

        .pipe(uglify())

        .pipe(gulp.dest(dstScript));

});


//处理CSS文件:压缩,然后换个名输出;

//命令行使用gulp css启用此任务;

gulp.task('css', function() {

    gulp.src(srcCss)

        .pipe(minifyCSS())

        .pipe(gulp.dest(dstCSS));

});


//SASS文件输出CSS,天生自带压缩特效;

//命令行使用gulp sass启用此任务;

gulp.task('sass', function() {

    gulp.src(srcSass)

        .pipe(sass({

            outputStyle: 'compressed'

        }))

        .pipe(gulp.dest(dstSass));

});


//图片压缩任务,支持JPEG、PNG及GIF文件;

//命令行使用gulp jpgmin启用此任务;

gulp.task('imgmin', function() {

    var jpgmin = imageminJpegRecompress({

            accurate: true,//高精度模式

            quality: "high",//图像质量:low, medium, high and veryhigh;

            method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;

            min: 70,//最低质量

            loops: 0,//循环尝试次数, 默认为6;

            progressive: false,//基线优化

            subsample: "default"//子采样:default, disable;

        }),

        pngmin = imageminOptipng({

            optimizationLevel: 4

        });

    gulp.src(srcImage)

        .pipe(imagemin({

            use: [jpgmin, pngmin]

        }))

        .pipe(gulp.dest(dstImage));

});


//把所有html页面扔进dist文件夹(不作处理);

//命令行使用gulp html启用此任务;

gulp.task('html', function() {

    gulp.src(srcHtml)

        .pipe(gulp.dest(dstHtml));

});


//服务器任务:以dist文件夹为基础,启动服务器;

//命令行使用gulp server启用此任务;

gulp.task('server', function() {

    browserSync.init({

        server: "../dist"

    });

});


//监控改动并自动刷新任务;

//命令行使用gulp auto启动;

gulp.task('auto', function() {

    gulp.watch(srcScript, ['script']);

    gulp.watch(srcCss, ['css']);

    gulp.watch(srcSass, ['sass']);

    gulp.watch(srcImage, ['imgmin']);

    gulp.watch(srcHtml, ['html']);

    gulp.watch('../dist/**/*.*').on('change', browserSync.reload);

});


//gulp默认任务(集体走一遍,然后开监控);

gulp.task('default', ['script', 'css', 'sass', 'imgmin', 'html', 'server', 'auto']);
















// 载入外挂
var gulp = require('gulp'),  
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

// 样式
gulp.task('styles', function() {  
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// 脚本
gulp.task('scripts', function() {  
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// 图片
gulp.task('images', function() {  
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {  
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {  
    gulp.start('styles', 'scripts', 'images');
});

// 看手
gulp.task('watch', function() {

  // 看守所有.scss档
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // 看守所有.js档
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // 看守所有图片档
  gulp.watch('src/images/**/*', ['images']);

  // 建立即时重整伺服器
  var server = livereload();

  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  gulp.watch(['dist/**']).on('change', function(file) {
    server.changed(file.path);
  });

});












