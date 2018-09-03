const   gulp          = require('gulp'),
        sass          = require('gulp-sass'),
        autoprefixer  = require('gulp-autoprefixer'),
        browserSync   = require('browser-sync').create();

let path = {
    sass: ['../assets/styles/intranet/layouts/**/*.scss'],
    toAllScssPartials: '../assets/styles/intranet/**/*.scss',
    css: '../../dist/'
};

gulp.task('sass', function() {
    gulp.src(path.sass)
        .pipe(sass())
        .pipe(gulp.dest(path.css))
        .pipe(browserSync.stream())
});

gulp.task('browser-sync', ['sass'], function() {  
    browserSync.init({
        server: {
            baseDir: "../../"
        }
    });
    gulp.watch(path.toAllScssPartials, ['sass'])
});

gulp.task('default', ['browser-sync'])