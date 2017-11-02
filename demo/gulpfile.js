var gulp = require("gulp"),
    htmlImport = require("../index");

gulp.task("copy", function() {
    return gulp.src(["./src/**/*"])
        .pipe(gulp.dest("./dist"));
});

gulp.task("htmlImport", ["copy"], function() {
    return gulp.src("./dist/**/*.html")
        .pipe(htmlImport())
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["htmlImport"]);