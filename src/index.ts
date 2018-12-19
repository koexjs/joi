import { Context, Middleware } from 'koa';
import * as Joi from 'joi';

declare module 'koa' {
  export interface Context {
    /**
     * validate the value conforms to schema. throw 422, 'Validation Failed', { code: 'invalid_param', error }.
     * @param schema validate schema
     * @param data validate data
     *
     * example:
     * const schema = Joi.object().keys({
     *   name: Joi.string().min(3).max(30).required(),
     *   age: Joi.number().integer().min(1),
     *   gender: Joi.string().required(),
     * });
     *
     *  const data = {
     *    name: 'string',
     *    age: 'int',
     *    gender: male',
     *  };
     *
     *  validate(schema, data);
     */
    validate: <D>(schema: Joi.SchemaLike, data?: D) => Promise<D>;
  }
}

/**
 * validate
 */
export default (): Middleware => {
  const validateFn = async <D>(ctx: Context, schema: Joi.SchemaLike, data?: D) => {
    const _data: D = data || (ctx.request as any).body;
    const { error, value } = Joi.validate(_data, schema);

    if (error) {
      ctx.throw(422, 'Validation Failed', {
        code: 'invalid_param',
        error,
      });
    }

    return value;
  };

  return async function validate(ctx: Context, next: () => Promise<void>) {
    if (!ctx.validate) {
      ctx.validate = async <D>(schema: Joi.SchemaLike, data?: D) => {
        return validateFn(ctx, schema, data);
      };
    }

    await next();
  };
};
