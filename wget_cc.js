/**
 * Created by fengqiaogang on 15/4/4.
 */

var wget = require("./app/wget.js");

var path, url;
//检测是否有输入目录
if (process.argv[2]) {
    path = process.argv[2];
}
if (process.argv[3]) {
    url = process.argv[3];
}

if (!path) {
    console.log("请传入文件下载存放目录");
}
else if (!url) {
    console.log("请传入需要下载的 URL 地址");
}
else {
    wget(path, url);
}

