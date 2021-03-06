'use strict';
/**
 * verify
 */
import { Context, Application } from 'egg';

export default function jwtMiddleware(option, app: Application) {
  return async (ctx: Context, next) => {
    const apiNoAuth =
      ctx.url.startsWith('/api/login') ||
      ctx.url.endsWith('/api/user') ||
      ctx.url.endsWith('/api/version') ||
      ctx.url.endsWith('qiu/test') ||
      ctx.url.endsWith('/email_username/verify');
    if (apiNoAuth) {
      return next();
    }
    const headers = ctx.request.headers;
    let token;
    try {
      token = headers.authorization;
    } catch (err) {
      return (ctx.body = {
        status: 'fail',
        description: err,
      });
    }

    if (!token) {
      return (ctx.body = {
        status: 'fail',
        description: 'Token not found',
      });
    }
    const result = app['util'].jwt.tokenService.verifyToken(token);
    if (result === false) {
      return (ctx.body = {
        status: 'fail',
        description: 'Token verify failed',
      });
    }

    const reply = await app['redis'].get(token);

    console.log('当前用户:', reply);
    if (reply) {
      // prolong token
      app['redis'].expire(token, 3 * 24 * 60 * 60);
      const currentUser = JSON.parse(reply);
      ctx.request['currentUser'] = currentUser;
      return next();
    }
    return (ctx.body = {
      status: 'fail',
      description: 'Token invalid',
    });
  };
}
