/*
 * @Author: Aerdelan 1874863790@qq.com
 * @Date: 2023-04-25 11:55:55
 * @LastEditors: Aerdelan 1874863790@qq.com
 * @LastEditTime: 2023-04-27 23:11:54
 * @FilePath: \案例一\routes\users.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;