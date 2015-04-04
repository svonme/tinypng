# tinypng
使用 tinypng 提供的 API 利用 Node.js 进行本地批量压缩图片

需要到 https://tinypng.com/developers 申请密匙

将申请的密匙填写到 tinypng/config/key.js 中

然后就可以使用 node tinypng.js path true/false [true 覆盖原图，false 将保留原图创建一张 .min 的图片]
