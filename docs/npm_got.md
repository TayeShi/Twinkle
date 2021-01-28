# GOT

## Install 安装

```shell
npm install got
```

## Usage 使用

### 支持Promise

```javascript
const got = require('got')

(async () => {
	try {
    const response = await got('https://sindresorhus.com')
    console.log(response.body)
  } catch (error) {
    console.log(error.response.body)
  }
})()
```

### 带JSON的请求

```javascript
const got = require('got')
(async () => {
  const { body } = await got.post('https://httpbin.org/anything', {
    json: {
      hello: 'world'
    },
    reponseType: 'json'
  })
  console.log(body.data)
})()
```

更多内容可以看 `JSON mode` 相关的内容

### Streams 的方式

TODO

## API 

默认的请求方式是 `GET` ，但是可以改为其他请求方式，例如: `options.method`

**默认情况下，Got 会重试失败的请求。要关闭此选项，设置 `options.retry` 为 `0`**

### got(url?, options?)

返回一个Promise，包含 `Response object` 或者 一个`Got Stream`(如果`options.isStream`设置为true)

#### url

Type: `string | object`

这个URL作为 一个string字符串、一个`https.request`options对象属性 或者 一个 `WHATWG URL`(TODO ???)

在`options`中的属性将覆盖解析的`url`中的属性

如果没有指定协议，它将抛出一个`TypeError`

Note: query string 不会解析成 search params。例如：

```javascript
// query上的参数这里会被encode  原本为  a b
got('https://example.com/?query=a b'); //=> https://example.com/?query=a%20b

// params中的参数解析为了a+b
got('https://example.com/', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b

// 这里 params 中的参数覆盖了url上的query
got('https://example.com/?query=a b', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
```

#### options

- Type: `object`
  - `https.request` 中的任何选项

TODO 下面

**Note:** Legacy URL support is disabled. `options.path` is supported only for backwards compatibility. Use `options.pathname` and `options.searchParams` instead. `options.auth` has been replaced with `options.username` & `options.password`.

##### method  options.method 属性

- Type: `string`
- Default: `GET`

发送HTTP请求的method方法

##### prefixUrl  options.prefixUrl 属性

- Type: `string | URL`

当指定了此参数，`prefixUrl`将添加到`url`前面。此前缀可以是任意相对或绝对有效的URL。

Note: 如果 `url`参数是一个URL实例，`prefixUrl`将被忽略

Node: 在输入中不允许再有`/`，不然`https://example.com/foo`输入为`/bar`，则可能为`https://example.com/foo/bar`或`https://example.com/bar`

Tip: `prefixUrl`可用于用`got.extend()`创建特定got实例

Tip: 只要URL中包含`prefixUrl`，就可以通过hooks更改`prefixUrl`。如果URL不在包含`prefixUrl`，它将抛出自身

```javascript
const got = require('got')

(async () => {
  await got('unicorn', { prefixUrl: 'https://cats.com' })
  // => 'https://cats.com/unicorn'
  
  const instance = got.extend({
    prefixUrl: 'https://google.com'
  })
  await instance('unicorn', {
    hooks: {
      beforeRequest: [
        options => {
          options.prefixUrl: 'https://cats.com'
        }
      ]
    }
  })
  // => 'https://cats.com/unicorn'
})()
```

##### headers  options.headers 属性

- Type: `object`
- Default: `{}`

请求头。

现有headers将被覆盖，headers中的参数为undefined的将被省略。

##### isStream  options.isStream 属性

- Type: `boolean`
- Default: `false`

返回一个`Stream`而不是一个`Promise`。这相当于调用`got.stream(url, options?)`。

###### body  options.body 属性

- Type: `string | Buffer | stream.Readable` or `form-data`实例 (https://github.com/form-data/form-data)

Note #1: `body`选项不能和`json`或`form`选项一起使用。
Note #2: 如果使用此选项，`got.stream()`将变为只读。
Note #3: 在使用`GET`或`HEAD`请求方式时，除非在请求方式为`GET`时，同时`allowGetBody`选项设置为`true`，否则将抛出`TypeError`错误。
Note #4: 此选项不会枚举，而且不会与实例默认内容合并。

当`body`是一个 `string` / `Buffer` / `form-data`实例 时， `content-length`将被自动设置，并且`content-length`和`transfer-encoding`不能通过`options.headers`手动修改

从 Got12 开始，当`body`是一个`fs.createReadStream`时，`content-length`不会自动设置

##### json  options.json 属性

- Type: `object | Array | number | string | boolean | null` （JSON可序列化的值）

Note #1: 如果使用此选项，`got.stream()`将变为只读。
Note #2: 此选项不会枚举，而且不会与实例默认内容合并。

请求体为json。如果 header 中`Content-Type` 没有设置，它将设置为 `application/json`。

##### context  options.context 属性

- Type: `object`

User data 用户数据。`context`将被浅合并且可枚举的。如果它包含不可枚举的属性，则不会被合并。

对于存储验证令牌是很有用的：

```javascript
const got = require('got')

const instance = got.extend({
  hooks: {
    beforeRequest: [
      options => {
        if (!options.context || !options.context.token) {
          throw new Error('Token required')
        }
        options.headers.token = options.context.token
      }
    ]
  }
})

(async () => {
  const context = {
    token: 'secret'
  }
  const response = await instance('https://httpbin.org/headers', { context })
  console.log(response.body)
})()
```

##### responseType  options.responseType 属性

- Type: `string`
- Default: 'text'

Note: 当使用streams流的时候，此选项会被忽略。

解析方法。可以是`text`, `json` 或 `buffer`

responsePromise 有`.text()`， `.json()和.buffer()`方法用于为已解析的正文返回另一个Promise。
像设置options为`{responseType: 'json', resolveBodyOnly: true}`不会影响主要的Got promise。

例如：

```javascript
(async () => {
  const responsePromise = got(url);
	const bufferPromise = responsePromise.buffer();
	const jsonPromise = responsePromise.json();

	const [response, buffer, json] = await Promise.all([responsePromise, bufferPromise, jsonPromise]);
	// `response` is an instance of Got Response
	// `buffer` is an instance of Buffer
	// `json` is an object
})()
```

```javascript
const body = await got(url).json();

// 上面的在语义上和下面的相同
const body = await got(url, {responseType: 'json', resolveBodyOnly: true});
```

Note: `buffer`将返回 the raw body buffer 原始换缓冲区。修改它将影响`promise.text()`和`promise.json()`的结果。在重写buffer前，要先调用`Buffer.from(buffer)拷贝它。

##### parseJson  options.parseJson 属性

- Type: `(text: string) => unknown`
- Default: `(text: string) => JSON.parse(text)`

一个用于解析响应为JSON的function

例如：(Using [`bourne`](https://github.com/hapijs/bourne) to prevent prototype pollution)

```javascript
const got = require('got');
const Bourne = require('@hapi/bourne');

(async () => {
	const parsed = await got('https://example.com', {
		parseJson: text => Bourne.parse(text)
	}).json();

	console.log(parsed);
})();
```

##### stringfyJson  options.stringfyJson 属性

- Type: `(object: unknown) => string`
- Default: `(object: unknown) => JSON.stringify(object)`

A function used to stringify the body of JSON requests.

例如：忽略`_`开始的属性

```javascript
const got = require('got');

(async () => {
	await got.post('https://example.com', {
		stringifyJson: object => JSON.stringify(object, (key, value) => {
			if (key.startsWith('_')) {
				return;
			}

			return value;
		}),
		json: {
			some: 'payload',
			_ignoreMe: 1234
		}
	});
})();
```

设置所有numbers 为 strings

```javascript
const got = require('got');

(async () => {
	await got.post('https://example.com', {
		stringifyJson: object => JSON.stringify(object, (key, value) => {
			if (typeof value === 'number') {
				return value.toString();
			}

			return value;
		}),
		json: {
			some: 'payload',
			number: 1
		}
	});
})();
```

##### resolveBodyOnldy  options.resolveBodyOnldy 属性

- Type: `boolean`
- Default: `false`

当设置为`true`时，promise返回 Response body 而不是 Response 对象。

##### cookieJar todo

##### cookieJar.setCookie todo

##### cookieJar.getCookieString todo

##### ignoreInvalidCookies todo

##### encoding todo

##### form todo

##### searchParams todo

##### timeout todo

##### retry todo

##### followRedirect todo

##### methodRewriting todo

##### methodRewriting todo

##### allowGetBody todo

##### maxRedirects todo

##### decompress todo

##### cache todo

##### cacheOptions todo

##### dnsCache todo

##### dnsLookupIpVersion todo

##### lookup todo

##### request todo

##### http2 todo

##### throwHttpErrors todo

##### agent todo

##### hooks todo

###### hooks.init

###### hooks.beforeRequest

###### hooks.beforeRedirect

###### hooks.beforeRetry

###### hooks.afterResponse

###### hooks.beforeError

##### pagination todo

###### pagination.transform

###### pagination.paginate

###### pagination.filter

###### pagination.shouldContinue

###### pagination.countLimit

###### pagination.backoff

###### pagination.requestLimit

###### pagination.stackAllItems

##### localAddress

## Advanced HTTPS API

Note: 如果请求不是HTTPS，这些选项将被忽略。

##### https.certificateAuthority

##### https.key

##### https.certificate

##### https.passphrase

##### https.pfx

##### https.rejectUnauthorized

##### https.checkServerIdentity

