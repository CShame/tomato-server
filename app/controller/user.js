'use strict';
const BaseController = require('./base');
const { userValidationRule, loginValidationRule } = require('../validate/user');
class UserController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.user;
    this.validateRule = userValidationRule;
  }

  /**
   * 登录
   */
  async login() {
    const { ctx, app } = this;
    const invalid = app.validator.validate(
      loginValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数错误！',
      };
      return;
    }
    const users = await ctx.service.user.findAll(
      {},
      { username: ctx.request.body.username }
    );
    if (users.length === 0) {
      ctx.body = {
        status: 'fail',
        description: '用户不存在',
      };
      return;
    }
    const user = {
      username: users[0].username,
      timestamp: new Date().valueOf(),
    };
    const password = users[0].password;
    const verifyPWD = await users[0].comparePassword(ctx.request.body.password);
    if (password === ctx.request.body.password || verifyPWD) {
      const token = app.util.jwt.tokenService.createToken(user);
      ctx.logger.info(user, token);
      await app.redis.set(token, JSON.stringify(user), 'EX', 3 * 24 * 60 * 60);
      ctx.body = {
        status: 'success',
        token,
        userinfo: users[0],
      };
    } else {
      ctx.body = {
        status: 'fail',
        description: 'Get token failed. Check the password',
      };
    }
  }

  /**
   * 登出
   */
  async logout() {
    const { ctx, app } = this;
    const headers = ctx.request.headers;
    const token = headers.authorization;
    await app.redis.del(token);
    ctx.body = {
      status: 'success',
      description: 'logout succeed',
    };
  }

  /**
   * 邮箱验证
   */
  async emailUserNameVerify() {
    const { ctx } = this;
    const email = ctx.request.body.email;
    const username = ctx.request.body.username;
    const {
      emailRet,
      usernameRet,
    } = await ctx.service.user.emailUserNameVerify(email, username);

    if (emailRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: '邮箱已存在！',
      };
    } else if (usernameRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: '用户名已存在！',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '邮箱可用！',
      };
    }
  }

  /**
   * 上传头像
   */
  async uploadHeadImg() {
    const fs = require('fs');
    const path = require('path');

    const { ctx } = this;
    const userid = ctx.request.body.userid;
    const imgData = ctx.request.body.imgData;
    ctx.logger.info('上传中:' + userid);

    // 过滤data:URL
    const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
    const dataBuffer = new Buffer(base64Data, 'base64');
    const rootDir = path.resolve(__dirname, '../../');
    const relateUrl = rootDir + '/uploadfile/headimg/' + userid + '.png';

    const imgPath = relateUrl;
    ctx.logger.info('上传中(path):' + imgPath);
    fs.writeFile(imgPath, dataBuffer, async err => {
      if (err) throw err;
      ctx.logger.info('The file has been saved!');
      await ctx.service.user.updateHeadImg(userid, userid + '.png');
    });
    ctx.status = 200;
    ctx.body = {
      success: true,
      msg: '保存成功！',
    };
  }

  /**
   * 下载头像
   * 通过 query 参数获取相关内容
   */
  async downloadHeadImg() {
    const { ctx } = this;
    const send = require('koa-send');
    if (!ctx.request.currentUser) {
      ctx.status = 500;
      ctx.body = '请先登录!!!';
      ctx.logger.info('请先登录!!!');
      return;
    }
    const relateUrl = ctx.params.path;
    const savePath = '/uploadfile/headimg/' + relateUrl + '.png';
    // 默认会加上本服务器地址
    ctx.logger.info('发送中!!!');
    await send(ctx, savePath);
  }

  /**
   * 更新性别
   */
  async updateSex() {
    const { ctx } = this;
    const id = ctx.request.body.userid;
    const sex = ctx.request.body.sex;
    const result = await ctx.service.user.updateSex(id, sex);
    ctx.body = result;
  }

  /**
   * 更新昵称
   */
  async updateDisplayName() {
    const { ctx } = this;
    const id = ctx.request.body.userid;
    const displayname = ctx.request.body.displayname;
    const result = await ctx.service.user.updateDisplayName(id, displayname);
    ctx.body = result;
  }

  /**
   * 更新邮箱
   */
  async updateEmail() {
    const { ctx } = this;
    const id = ctx.request.body.userid;
    const email = ctx.request.body.email;
    const result = await ctx.service.user.updateEmail(id, email);
    ctx.body = result;
  }

  /**
   * 更新位置
   */
  async updateLocation() {
    const { ctx } = this;
    const id = ctx.request.body.userid;
    const location = ctx.request.body.location;
    const result = await ctx.service.user.updateLocation(id, location);
    ctx.body = result;
  }

  /**
   * 更新签名
   */
  async updateBio() {
    const { ctx } = this;
    const id = ctx.request.body.userid;
    const bio = ctx.request.body.bio;
    const result = await ctx.service.user.updateBio(id, bio);
    ctx.body = result;
  }
}
module.exports = UserController;
