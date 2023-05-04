/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-25 10:41:30
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-04-26 10:24:52
 * @FilePath: \代码\2.代码模块化\models\BookModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mongoose = require('mongoose')
// 这里放连接成功之后要写的方法

// 创建模型对象
// 对文档操作的封装对象,第一个是集合名称，第二个是对象
let AccountModel = new mongoose.Schema({
    // 文章标题
    title: {
        type: String,
        required: true
    },
    // 时间
    time: Date,
    // 类型
    type: {
        type: Number,
        // 默认值
        default: -1
    },
    body: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    }
})


// 暴露模型对象
module.exports = AccountModel;