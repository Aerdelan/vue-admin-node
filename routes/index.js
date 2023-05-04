/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-25 11:55:55
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-04-27 23:12:23
 * @FilePath: \案例一\routes\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const validator = require('validator');
const crypto = require('crypto');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
// 注册操作
const MAX_OPERATIONS_PER_IP = 15;
const ipCountMap = new Map(); // 记录每个 IP 的操作次数

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }

    // 验证和清理输入的用户名和密码
    const cleanUsername = validator.escape(username.trim());

    // 使用SHA-256加密密码
    const hashPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');

    // 判断当前 IP 的操作次数是否超过限制
    const ip = req.ip;
    const count = ipCountMap.get(ip) || 0;
    if (count >= MAX_OPERATIONS_PER_IP) {
      return res.status(429).send('请求过于频繁，请稍后再试');
    }

    // 查询用户是否已存在
    const user = await UserModel.findOne({ username: cleanUsername });
    if (user) {
      return res.status(400).send('用户名已被注册');
    }

    // 创建新用户
    await UserModel.create({ username: cleanUsername, password: hashPassword });

    // 更新当前 IP 的操作次数
    ipCountMap.set(ip, count + 1);
    return res.status(200).send('注册成功');
  } catch (error) {
    console.error(error);
    return res.status(500).send('服务器错误');
  }
});


// 登录操作

const THROTTLE_TIME = 5000; // 限制时间间隔为5秒
let lastLoginTime = 0; // 上一次登录时间


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }


    // 验证和清理输入的用户名和密码
    const cleanUsername = validator.escape(username.trim());

    // 使用SHA-256加密密码
    const hashPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');

    const now = Date.now();
    if (now - lastLoginTime < THROTTLE_TIME) {
      return res.status(429).send('请求过于频繁，请稍后再试');
    }
    lastLoginTime = now;

    // 查询用户是否存在
    const user = await UserModel.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(401).send('账号或密码错误');
    }

    // 校验密码
    if (hashPassword !== user.password) {
      return res.status(401).send('账号或密码错误');
    }

    // 生成token
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    // 登录成功，返回token和用户信息
    return res.status(200).json({ user, token });

  } catch (error) {
    console.error(error);
    return res.status(500).send('服务器错误');
  }
});

module.exports = router;