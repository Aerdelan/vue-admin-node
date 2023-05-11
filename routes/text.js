/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-26 16:29:08
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-05-10 14:30:12
 * @FilePath: \案例一\routes\text.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
// 数据验证
const Joi = require('joi');
// 处理状态异常
const boom = require('boom');
const router = express.Router();
const ArticleModel = require('../models/ArticleModel');

//引入jsonwebtoken模块
// token加密
const jwt = require('jsonwebtoken');

// GET请求，返回文章列表
router.get('/articles', async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return next(boom.unauthorized('未登录用户无权操作'));
    }
    try {
        // 验证token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        // 分页处理
        // 前端不给数值就默认为5
        const limit = parseInt(req.query.limit) || 5; // 每页显示的文章数，默认为5
        // 前端不给数值就默认为1
        const page = parseInt(req.query.page) || 1; // 当前页数，默认为第1页
        // 根据分页参数计算出需要跳过的文章数量 skip。
        const skip = (page - 1) * limit;
        // 通过调用 find() 方法获取文章列表，skip() 方法跳过指定数量的文章，limit() 方法限制查询结果数量。查询结果将被赋值给 articles 变量。
        const articles = await ArticleModel.find().skip(skip).limit(limit);
        // 使用 countDocuments() 方法获取文章总数，将结果赋值给 total 变量。
        const total = await ArticleModel.countDocuments();
        // 将查询结果和分页信息封装成一个对象返回给前端，其中 data 属性存储文章列表，meta 属性存储分页信息，包括总数 total、当前页数 page 和每页显示的文章数 limit。
        res.send({ data: articles, meta: { total, page, limit } });
    } catch (err) {
        console.error(err);
        // 抛出异常
        next(boom.internal('获取文章列表失败'));
    }
});

// POST请求，添加新文章
router.post('/articles/new', async (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.string().required(),
        body: Joi.string().required(),
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

    //检查headers中是否有token
    const token = req.headers['authorization'];
    if (!token) {
        return next(boom.unauthorized('未登录用户无权操作'));
    }

    try {
        //验证token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        await schema.validateAsync(req.body);
        const article = await ArticleModel.create(req.body);
        console.log(article, '文章添加成功');
        res.send({ message: '文章添加成功' });
    } catch (err) {
        console.error(err);
        next(boom.internal('添加文章失败'));
    }
});
// PUT请求，修改文章
router.put('/articles/edit/:id', async (req, res, next) => {
    const id = req.params.id;

    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(),
        body: Joi.string().required(),
    });
    console.log(req.body);
    // 检查 headers 中是否有 token
    const token = req.headers['authorization'];
    if (!token) {
        return next(boom.unauthorized('未登录用户无权操作'));
    }

    try {
        // 验证 token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // 验证请求体数据
        const { error } = schema.validate(req.body);
        if (error) {
            throw boom.badRequest(error.details[0].message);
        }

        // 更新文章
        const article = await ArticleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!article) {
            throw boom.notFound('文章修改失败：ID不存在');
        }

        console.log(article, '文章修改成功');
        res.send({ message: '文章修改成功' });
    } catch (err) {
        console.error(err);
        next(boom.internal('修改文章失败'));
    }
});

// DELETE请求，删除文章
router.delete('/articles/delete/:id', async (req, res, next) => {
    const id = req.params.id;

    //检查headers中是否有token
    const token = req.headers['authorization'];
    if (!token) {
        return next(boom.unauthorized('未登录用户无权操作'));
    }

    try {
        //验证token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        const article = await ArticleModel.findByIdAndDelete(id);
        console.log(article, '文章删除成功');
        res.send({ message: '文章删除成功' });
    } catch (err) {
        console.error(err);
        if (err.name === 'CastError') {
            return next(boom.badRequest('删除文章失败：ID不存在'));
        }
        next(boom.internal('删除文章失败'));
    }
});

module.exports = router;
