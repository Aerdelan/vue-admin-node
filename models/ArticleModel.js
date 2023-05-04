/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-26 16:35:48
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-04-26 16:35:58
 * @FilePath: \案例一\models\ArticleModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
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
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ArticleModel = mongoose.model('Article', articleSchema);

module.exports = ArticleModel;