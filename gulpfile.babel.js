import gulp from "gulp";
import install from "gulp-install";
import zip from "gulp-zip";
import fs from "fs";
import mocha from "gulp-mocha";
import { deleteAsync } from "del";

const packageJson = JSON.parse(fs.readFileSync("./package.json"));
const packageName = packageJson.name + "-" + packageJson.version + ".zip";

gulp.task("clean", function () {
    return deleteAsync(["./dist", "./" + packageName + "-*.zip"]);
});

gulp.task("test", function () {
    return gulp
        .src("test/*.js", { read: false })
        .pipe(mocha({ reporter: "spec" }));
});

gulp.task("js", function () {
    return gulp
        .src("src/*.mjs")
        .pipe(gulp.dest("dist/"));
});

gulp.task("npm", function () {
    return gulp
        .src("./package.json")
        .pipe(gulp.dest("./dist/"))
        .pipe(install({ production: true }));
});

gulp.task("zip", function () {
    return gulp.src(["dist/**/*", "!dist/package*.json", "dist/.*"]).pipe(zip(packageName)).pipe(gulp.dest("./"));
});

gulp.task("default", gulp.series(["clean", "js", "npm", "zip"]));
