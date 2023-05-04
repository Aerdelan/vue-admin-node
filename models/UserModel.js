/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-25 10:57:45
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-04-26 15:02:14
 * @FilePath: \代码\2.代码模块化\models\MovieModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */
const mongoose = require('mongoose')
//创建文档结构
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

const UserModel = mongoose.model('user', UserSchema)
// 暴露
module.exports = UserModel