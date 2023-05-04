/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-25 10:24:11
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-05-04 09:34:02
 * @FilePath: \代码\2.代码模块化\db\db.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { DBHOST, DBPORT, DBNAME } = require("../config/config");

module.exports = function (success, error) {
    const mongoose = require("mongoose");
    // 设置strictQuery为true
    mongoose.set("strictQuery", true);
    // 导入服务器配置
    const { DBHOST, DBPORT, DBNAME } = require('../config/config.js')
    // 连接mongodb服务
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);
    mongoose.connection.once("open", () => { success(); console.log('连接成功'); });
    mongoose.connection.on("error", () => {
        console.log("连接失败");
    }); //设置连接错误的回调
    mongoose.connection.on("close", () => {

        console.log("连接关闭");
    }); //设置连接关闭的回调
};
