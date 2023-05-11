const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// 设置图片存储路径和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


// 创建Multer对象
const upload = multer({ storage: storage });

// 创建节流阀对象
const throttle = {
    lastTime: 0,
    interval: 1000
};

// token验证中间件
async function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return next(boom.unauthorized('未登录用户无权操作'));
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return next(boom.unauthorized('Token已过期，请重新登录'));
        } else {
            return next(boom.unauthorized('Token验证失败，请重新登录'));
        }
    }
}

// 处理添加图片的请求
router.post('/addImage', authenticateToken, validateImage, throttleMiddleware, upload.single('image', { limits: { fileSize: 5000000 } }), function (req, res) {
    // 获取上传的文件信息
    const file = req.file;
    if (!file) {
        return res.status(400).send('Please upload a file');
    }
    // 返回上传成功的信息
    res.send({ message: 'File uploaded successfully', filename: file.filename });
});


// 处理获取所有图片路径的请求
router.get('/getAllImagePaths', authenticateToken, throttleMiddleware, function (req, res) {
    const directoryPath = path.join(__dirname, '../public/images');
    const fileTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    let imagePaths = [];

    // 递归遍历文件夹内的所有图片路径
    const walkSync = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                walkSync(filePath);
            } else if (fileTypes.includes(path.extname(filePath).toLowerCase())) {
                imagePaths.push('/images/' + file);
            }
        });
    };

    walkSync(directoryPath);

    res.status(200).json(imagePaths);
});


// Joi验证上传文件的中间件
function validateImage(req, res, next) {
    const schema = Joi.object({
        image: Joi.string().required(),
        size: Joi.number().max(5000000).required(),
        mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/gif').required()
    });
    const { error } = schema.validate(req.file);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

// 节流阀中间件
function throttleMiddleware(req, res, next) {
    const now = Date.now();
    if (now - throttle.lastTime > throttle.interval) {
        throttle.lastTime = now;
        next();
    } else {
        res.status(429).send('Too many requests');
    }
}

// 优化处理未知路由的请求
router.use('*', function (req, res) {
    res.status(404).send('Not found');
});

module.exports = router;
