# joi

[![NPM version](https://img.shields.io/npm/v/@koex/joi.svg?style=flat)](https://www.npmjs.com/package/@koex/joi)
[![Coverage Status](https://img.shields.io/coveralls/koexjs/joi.svg?style=flat)](https://coveralls.io/r/koexjs/joi)
[![Dependencies](https://img.shields.io/david/koexjs/joi.svg)](https://github.com/koexjs/joi)
[![Build Status](https://travis-ci.com/koexjs/joi.svg?branch=master)](https://travis-ci.com/koexjs/joi)
![license](https://img.shields.io/github/license/koexjs/joi.svg)
[![issues](https://img.shields.io/github/issues/koexjs/joi.svg)](https://github.com/koexjs/joi/issues)

> joi for koa extend.

### Install

```
$ npm install @koex/joi
```

### Usage

```javascript
// See more in test
import * as bodyParser from 'koa-body';
import onerror from '@zcorky/onerror';
import joi from '@koex/joi';
import * as router from '@koex/router';

import * as Koa from 'koa';
const app = new Koa();

app.use(onerror());
app.use(bodyParse());
app.use(joi());

app.use(router.post('/', (ctx, next) => {
  const data = await ctx.validate({
    name: 'string',
    age: 'int',
  });

  ctx.body = data;
}));

app.listen(8000, '0.0.0.0', () => {
  console.log('koa server start at port: 8000');
});
```

### Related
* [joi](https://github.com/hapijs/joi)