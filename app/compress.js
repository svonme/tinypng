/**
 * Created by fengqiaogang on 15/4/4.
 */

var path = require("path");
var fs = require("fs");
var upload = require("./upload.js");
var filePathRoot, consume, readFiletype = "utf-8", map = {}, keys = require("./../config/key.js")();
function readKey() {
    if (!keys) {
        throw "Key Read Error Key is Null";
    }
    else {
        if (keys instanceof Array) {
            if (keys.length < 1) {
                throw "Key Read Error Key is Null";
            }
        }
        else {
            if (typeof keys == "string") {
                keys = [keys];
            }
            else {
                throw "Key Read Error Key format error";
            }
        }
    }
    for (var i = 0; i < keys.length; i++) {
        map[keys[i]] || (map[keys[i]] = []);
    }
}
function init(callback) {
    consume = filePathRoot + "/config/consume.log";
    fs.readFile(consume, readFiletype, function (error, result) {
            if (error) {
                fs.appendFile(consume, "", readFiletype, function (state) {
                    if (state) {
                        throw "Create consume.log Error";
                    }
                    readKey();
                    callback();
                });
            }
            else {
                var data = result.split("\n");
                for (var i = 0; i < data.length; i++) {
                    var lin = data[i].split(" "), key = lin[0], value = lin[1];
                    var item = map[key] || [];
                    item.push(value);
                    map[key] = item;
                }
                readKey();
                callback();
            }
        }
    );
}

function writeconsume(key, oldpath) {
    var result = "\n" + key + " " + oldpath;
    if (map[key]) {
        map[key].push(oldpath);
    }
    else {
        map[key] = [oldpath];
    }
    fs.appendFile(consume, result, readFiletype, function (state) {
        if (state) {
            throw "Append consume.log Error";
        }
    });
}

function getpaths(oldpath, cover) {
    var imagespath = path.resolve(oldpath || "");

    var dada = [];
    var reg = /\.jpg|\.jpeg|\.png/i;

    var append = function (src) {
        var item = {
            oldsrc: src
        };
        //覆盖原图
        if (cover) {
            item["newsrc"] = src;
        }
        else {
            var lastIndexOf = src.lastIndexOf(".");
            item["newsrc"] = [src.substring(0, lastIndexOf), src.substring(lastIndexOf)].join(".min");
        }
        dada.push(item);
    };

    var recursive = function (resolve) {
        try {
            var files = fs.readdirSync(resolve);
            for (var i = 0, length = files.length; i < length; i++) {
                var itempath = files[i];//文件名称
                var Directory = path.join(resolve, itempath);//文件绝对路径
                //判断是否是文件夹
                var lstatSync = fs.lstatSync(Directory),
                    status = lstatSync.isDirectory();
                // 如果是文件夹
                if (status) {
                    //递归 循环
                    recursive(Directory, itempath);
                } else {
                    //如果是图片
                    if (files[i].match(reg)) {
                        append(path.join(resolve, itempath));
                    }
                }
            }
        }
        catch (e) {
            //判断是否是文件
            if (resolve.match(reg)) {
                append(resolve);
            }
        }
    };
    recursive(imagespath);
    return dada;
}
/**
 * 压缩图片
 * @param oldpath  目标图片文件夹或者文件
 * @param min      是否覆盖 true/false  如果为 true newpath 参数将失效
 */
module.exports = function (oldpath, cover) {
    filePathRoot = path.resolve(".");
    var list = getpaths(oldpath, cover);
    init(function () {
        var length = list.length;
        var log = [];
        var foreach = function (index) {
            if (index < length) {
                var item = list[index];
                var key = keys[0];
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (map[keys[i]].length < 500) {
                        key = keys[i];
                        break;
                    }
                }
                upload({
                    apikey: key,
                    oldsrc: item["oldsrc"],
                    newsrc: item["newsrc"],
                    error: function () {
                    },
                    callback: function () {
                        writeconsume(key, item["oldsrc"]);
                        log.push("图片 " + item["oldsrc"] + " 压缩后的地址为 " + item["newsrc"]);
                        foreach(++index);
                    }
                });
            }
            else {
                for (var i = 0; i < length; i++) {
                    log[i] && console.log(log[i]);
                }
            }
        };
        foreach(0);
    });
};