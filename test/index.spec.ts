import * as Koa from 'koa';
import * as bodyParser from 'koa-body';
import onerror from '@zcorky/koa-onerror';
import * as router from '@koex/router';
import * as Joi from 'joi';
import * as request from 'supertest';
import 'should';

import validate from '../src';

describe('koa validate', () => {
  it('work', () => {
    const app = new Koa();

    app.use(onerror({
      log: () => null,
    }));
    app.use(bodyParser());
    app.use(validate());

    app.use(router.post('/', async (ctx, next) => {
      const schema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        age: Joi.number().integer().min(1),
      });

      const data = await ctx.validate<{
        name: string;
        age: number;
      }>(schema);

      ctx.body = data;
    }));

    return request(app.listen())
      .post('/')
      .send({ name: 'name', age: 22 })
      .expect(200);
  });

  it('should 422', () => {
    const app = new Koa();

    app.use(onerror({
      log: () => null,
    }));
    app.use(bodyParser());
    app.use(validate());

    app.use(router.post('/', async (ctx, next) => {
      const schema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        age: Joi.number().integer().min(1).required(),
      });

      const data = await ctx.validate<{
        name: string;
        age: number;
      }>(schema);

      ctx.body = data;
    }));

    return request(app.listen())
      .post('/')
      .send({ name: 'name', age: 'age' })
      .expect(422, { message: 'Validation Failed' });
  });

  it('return body', () => {
    const app = new Koa();
    app.use(onerror({
      log: () => null,
    }));
    app.use(bodyParser());
    app.use(validate());

    app.use(router.post('/', async (ctx) => {
      const schema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        age: Joi.number().integer().min(1).required(),
      });

      const { name, age } = await ctx.validate<{
        name: string;
        age: number;
      }>(schema);

      ctx.body = {
        name,
        age,
      };
    }));

    return request(app.listen())
      .post('/')
      .send({ name: 'name', age: 22 })
      .expect(200, { name: 'name', age: 22 });
  });
});
