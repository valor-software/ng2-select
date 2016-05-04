var gulp = require('gulp');

gulp.paths = {
  tssrc: [
    '**/*.ts',
    '!**/*.d.ts',
    '!node_modules/**/*',
    '!bundles/**/*',
    '!typings/**/*']
};

require('require-dir')('./gulp-tasks');

gulp.task('default', function () {
  gulp.start('lint');
});
