/**
 * Created by fengqiaogang on 15/4/4.
 */

var path = require("path");
var child_process = require('child_process');
var download = function (param) {
    var exec = child_process.exec;
    var cmd = 'wget -d "' + param["url"] + '" -O ' + param["newsrc"];
    var free = exec(cmd, function (error, result) {
        if (error) {
            param["error"](error);
        }
        else {
            param["callback"](result);
        }
    });

    free.stderr.on('data', function (info) {
        console.log("Download : ", info);
    });
    //free.on('exit', function (code, signal) {
    //});
};

module.exports = function (param) {
    param && download(param);
};

