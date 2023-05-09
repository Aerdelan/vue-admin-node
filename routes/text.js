/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-26 16:29:08
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-05-05 16:29:49
 * @FilePath: \案例一\routes\text.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const Joi = require('joi');
const boom = require('boom');
const router = express.Router();
const ArticleModel = require('../models/ArticleModel');

//引入jsonwebtoken模块
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
        const limit = parseInt(req.query.limit) || 5; // 每页显示的文章数，默认为10
        const page = parseInt(req.query.page) || 1; // 当前页数，默认为第1页

        const skip = (page - 1) * limit;

        const articles = await ArticleModel.find().skip(skip).limit(limit);
        const total = await ArticleModel.countDocuments();

        res.send({ data: articles, meta: { total, page, limit } });
    } catch (err) {
        console.error(err);
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
