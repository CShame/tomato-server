'use strict';
/**
 * TODO: 增加 AUTH 逻辑
 */
import { Application, Context } from 'egg';

module.exports = (app: Application) => {
  return async function(ctx: Context, next) {
    ctx.logger.info('auth!');
    await next;
    ctx.logger.info('disconnect!');
    const socket = ctx.socket;
    app.redis.get(socket.id).then(userid => {
      ctx.logger.info('userid!', userid);
      if (userid) {
        app.redis.srem(userid + ':socket', socket.id).then(() => {});
        app.redis.del(socket.id).then(() => {});
      }
    });
  };
};