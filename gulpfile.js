const gulp           = require("gulp");
const browserify     = require("browserify");
const source         = require('vinyl-source-stream');
const watchify       = require("watchify");
const tsify          = require("tsify");
const gutil          = require("gulp-util");
const sourcemaps     = require('gulp-sourcemaps');
const buffer         = require('vinyl-buffer');
const stylus         = require('gulp-stylus');
const minify         = require('gulp-minify');
const imagemin       = require('gulp-imagemin');
const csso           = require('gulp-csso');

/*
** Typescript Part
*/
var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist/js"));
}

gulp.task('default', ['js'],  function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ["es2016"],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

// Task build js
gulp.task("js", bundle);

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);

/*
** Style Part
*/
gulp.task('css', function () {
    return gulp.src( './src/stylus/style.styl' )
        .pipe(stylus())
        .pipe(gulp.dest( './dist/css' ));
});

gulp.task('minify', ['css'] , function () {
    return gulp.src( './dist/css/style.css' )
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('imagemini', () =>
    gulp.src( './src/images/**/*' )
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest( './dist/images/' ))
);

// Task build css/img
gulp.task('build', ['css', 'imagemini'] );

// Si watch => Task build
gulp.task('watch', function () {
   gulp.watch( './src/stylus/**/*.styl', ['build']);
});
