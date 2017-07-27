const gutil = require("gulp-util");
const through = require("through2");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const types = ["html", "css", "js"];

module.exports = function(baseURL) {
    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) return callback(null, file);
        if (file.isStream()) return callback(new gutil.PluginError("sowth-gulp-htmlImport", "Streaming not supported."));
        const $ = cheerio.load(file.contents.toString(), {
            decodeEntities: false
        });
        $("import").each(function() {
            if ($(this).attr("src") && types.includes($(this).attr("type"))) {
                var data = fs.readFileSync(path.join(file.cwd, baseURL, $(this).attr("src")), {
                    encoding: "utf8"
                });
                switch ($(this).attr("type")) {
                    case "html":
                        $(data).insertAfter($(this));
                        break;
                    case "css":
                        $("<style>" + data + "</style>").insertAfter($(this));
                        break;
                    case "js":
                        $("<script>" + data + "</script>").insertAfter($(this));
                        break;
                }
            }
        }).remove();
        file.contents = new Buffer($.html());
        callback(null, file)
    });
}