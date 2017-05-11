'use strict';

const gulp   = require('gulp');
const babel  = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const notify = require('gulp-notify');

const BABEL_OPTIONS = {
    presets : ['es2015']
};

const UGLIFY_OPTIONS = {
    preserveComments : 'license'
};

gulp.task('scripts', () => {
    return gulp
        .src('./_src/jquery.share-sns.js')
        .pipe(babel(BABEL_OPTIONS).on('error', notify.onError( error => { return error.message; } )))
        .pipe(gulp.dest('./'))
        .pipe(uglify(UGLIFY_OPTIONS))
        .pipe(concat('jquery.share-sns.min.js'))
        .pipe(gulp.dest('./'))
});