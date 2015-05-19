/**
 * Created by fengqiaogang on 15/4/4.
 */

var path = require("path");
var fs = require('fs');
var child_process = require('child_process');
var download = function ($PATH, $URL) {
    if (!fs.existsSync($PATH)) {
        fs.mkdirSync($PATH);
    }
    console.log("PATH : ", $PATH);
    console.log("URL  : ", $URL);

    var exec = child_process.exec;
    var cmd = 'wget -e robots=off -w 1 -xq -np -nH -pk -m -t 1 -P ' + $PATH + ' ' + $URL + '';
    console.log(cmd);
    var free = exec(cmd, function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(result);
        }
    });

    free.stderr.on('data', function (info) {
        console.log("Download : ", info);
    });
    //free.on('exit', function (code, signal) {
    //});
};

module.exports = function ($PATH, $URL) {
    if (!$PATH) {
        console.log("请传入文件下载存放目录");
    }
    else if (!$URL) {
        console.log("请传入需要下载的 URL 地址");
    }
    else {
        download($PATH, $URL);
    }
};

