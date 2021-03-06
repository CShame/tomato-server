import { RedisChatService, RedisTomatoService } from '../app/util/redis';
import tokenService from '../app/util/jwt';

declare module 'egg' {
  interface Application {
    redis: any;
    mongoose: any;
    validator: any;
    util: {
      redis: {
        redisChatService: RedisChatService;
        redisTomatoService: RedisTomatoService;
      };
      jpush: {
        pushMessage(alias, alert, title): any;
      };
      jwt: {
        tokenService: {
          createToken(userinfo): any;
          verifyToken(token): any;
          expiresIn;
        };
      };
    };
  }
}
