const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      browserSync   = require('browser-sync');


gulp.task('sass', function() {
      gulp.src('../assets/styles/intranet/layouts/home/style.scss')
          .pipe(sass())
          .pipe(gulp.dest('../../dist/home'))
});

gulp.task('watch', function() {
    gulp.watch('../assets/styles/intranet/**/**/*.scss', ['sass'])
});