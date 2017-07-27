var gulp = require("gulp"),
    htmlImport = require("../index");

gulp.task("copy", function() {
    return gulp.src(["./src/**/*", "!./src/resources", "!./src/resources/**/*"])
        .pipe(gulp.dest("./dist"));
});

gulp.task("htmlImport", ["copy"], function() {
    return gulp.src("./dist/**/*.html")
        .pipe(htmlImport("./src/resources"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["htmlImport"]);