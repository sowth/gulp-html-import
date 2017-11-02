const gutil = require("gulp-util");
const through = require("through2");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

module.exports = function(baseURL) {
    baseURL = baseURL && typeof baseURL == "string" ? baseURL : null;
    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) return callback(null, file);
        if (file.isStream()) return callback(new gutil.PluginError("sowth-gulp-html-import", "Streaming not supported."));
        const $ = cheerio.load(file.contents.toString(), {
            decodeEntities: false
        });
        $("import").each(function() {
            var src = $(this).attr("src") || "",
                type = $(this).attr("type") || src.split(".").pop();
            if (!src || !["html", "css", "js"].includes(type)) return;
            var data = fs.readFileSync(baseURL ? path.join(file.cwd, baseURL, src) : path.join(file.base, src), {
                encoding: "utf8"
            });
            if (!data) return;
            type == "html" && $(data).insertAfter(this);
            type == "css" && $("<style>").html(data).insertAfter(this);
            type == "js" && $("<script>").html(data).insertAfter(this);
        }).remove();
        file.contents = new Buffer($.html());
        callback(null, file);
    });
};