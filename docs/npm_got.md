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

