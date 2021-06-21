# Nuxtjs

## start

### 安装

```shell
Yarn create nuxt-app <project-name>

...

cd <project-name>
yarn dev
```

### 路由

nuxtjs应用不必写router.js文件，`pages`目录下的`.vue`文件会自动生成路由

#### Navigation 导航

在nuxtjs中，使用`<NuxtLink />`替代vue中的`<RouterLink />`

如果是需要导航到外部地址，使用`<a>`标签

```vue
<template>
  <main>
    <h1>Home page</h1>
    <NuxtLink to="/about">
      About (internal link that belongs to the Nuxt App)
    </NuxtLink>
    <a href="https://nuxtjs.org">External Link to another page</a>
  </main>
</template>
```

### 目录结构

#### pages目录

`pages`中一个`.vue`文件就是一个页面，并且nuxtjs会自动生成对应的路由

#### components目录

`components`目录用于存放所有的vue组件

如果将组件设置为true，nuxtjs将自动扫描并将其添加到页面中。不需要再在<script>中手动引入

#### assets目录

`assets`目录存放未编译的资源文件，如：styles, images, fonts...

#### static目录

`static`目录下的文件直接映射到根目录，静态资源

#### nuxt.config.js文件

`nuxt.config.js`文件nuxt的单点配置文件，如果需要添加模块或者覆写setting就在这里面进行更改。

#### package.json文件

依赖项和脚本

### Commands and Deployment

TODO

## 概念

### Views

![Composition of a View in Nuxt.js](https://zh.nuxtjs.org/docs/2.x/views.png)

在nuxtjs中一个视图view的组成

#### pages

每个page都是一个vue组件，nuxtjs添加了特殊的函数和属性

#### page组件的properties

页面组件中有许多的属性。如head

#### Layouts

layout对于更改应用外观和感觉很有帮助，比如要包含一个侧边栏或不同移动或桌面布局

##### default layout 默认布局

在layouts文件中定义一个`default.vue`文件。所有没有指定布局的页面都将使用此布局。布局中唯一的东西是`<Nuxt />`

##### custom layout 自定义布局

在layouts目录中创建`.vue`文件，页面要使用自定义布局的时候设置`layout`属性，属性名为创建的自定义layout

例如：创建一个blog布局，`layouts/blog.vue`

```vue
<template>
  <div>
    <div>Blog Layout here</div>
    <Nuxt />
  </div>
</template>
```

使用blog布局

```vue
<template>
  <div>blog page</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'blog',
})
</script>
```

#### Error Page 错误页面

error page 用于显示错误页面，（服务端渲染的时候不会生效）

#### Document: App.html

### Context and Helpers

![aaa](https://zh.nuxtjs.org/docs/2.x/context.svg)

`context`对象在特定的Nuxt函数中存在，如：asyncData, plugins, middleware, nuxtServerInit。提供了应用当前请求的附加信息，且是可选的。

首先，`context`提供了对nuxt.js其他部分的访问，如：Vuex stroe, 底层链接实例等。因此，在服务端存在`req`, `res`而且`store`总是存在。。。。省略

默认context中的数据：

```javascript
function (context) { // Could be asyncData, nuxtServerInit, ...
  // Always available
  const {
    app,
    store,
    route,
    params,
    query,
    env,
    isDev,
    isHMR,
    redirect,
    error,
   $config
  } = context

  // Only available on the Server-side
  if (process.server) {
    const { req, res, beforeNuxtRender } = context
  }

  // Only available on the Client-side
  if (process.client) {
    const { from, nuxtState } = context
  }
}
```

#### Helper

##### `$nuxt` nuxtjs helper

`$nuxt`是一个helper，用于提高体验。在vue组件中通过`this.$nuxt`可以拿到它，客户端则使用`window.$nuxt`

###### Connection checker

`$nuxt.isOffline`可以快速查找用户是否存在互联网连接`isOffline`or`$isOnline`

##### Accessing the root instance

TODO

##### Refreshing page data 刷新页面数据

如果只是希望刷新`asyncData`和`fetch`提供的数据，使用`this.$nuxt.refresh()`

```vue
<template>
	<div>
   	<div>{{ content }}</div>
    <button @click="refresh">Refresh</button>
  </div>
</template>

<script>
	export default {
    asyncData() {
      return { content: 'Created at: ' + new Data() }
    },
    methods: {
      refresh() {
        this.$nuxt.refresh()
      }
    }
  }
</script>
```





