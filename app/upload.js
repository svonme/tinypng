/**
 * Created by fengqiaogang on 15/4/4.
 */

var path = require("path");
var child_process = require('child_process');
var JSON = require('./json.js');
var download = require('./download.js');

var upload = function (param) {
    var exec = child_process.exec;
    var cmd = "curl -i --user api:" + param["apikey"] + " --data-binary @" + param["oldsrc"] + " https://api.tinypng.com/shrink";
    var free = exec(cmd, function (error, result) {
        if (error) {
            param["error"](error);
        }
        else {
            var data = result.substring(result.lastIndexOf('"url"'));
            data = "{" + data.substring(0, data.lastIndexOf('}}')) + "}";
            data = JSON.parse(data);
            param["url"] = data["url"];
            param["url"] && download(param);
        }
    });
    free.stdout.on('data', function (info) {
    });
    free.stderr.on('data', function (info) {
        console.log("Upload : ", param["oldsrc"] + " - ", info);
    });
    //free.on('exit', function (code, signal) {
    //});
};

module.exports = function (param) {
    param && new upload(param);
};

