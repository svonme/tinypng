/**
 * Created by fengqiaogang on 15/4/4.
 */

var tinypng = require("./app/compress.js");

var path, min;
//检测是否有输入目录
if (process.argv[2]) {
    path = process.argv[2];
}
if (process.argv[3]) {
    min = process.argv[3];
}


//tinypng("path",false);

tinypng(path, min);