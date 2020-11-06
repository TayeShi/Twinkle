# vuepress

## 起步

### 安装配置

```shell
# 1. 进入项目目录
# 2. yarn init
yarn init
# 3. yarn 安装 vuepress
yarn add -D vuepress
# 4. 创建保存md文件的文件夹
mkdir docs && echo '# Hello VuePress' > docs/README.md
# 5. 更改package.json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
# 6. run
yarn docs:dev or yarn docs:build

# ps:
# yarn docs:build 会生成文件到 /docs/.vuepress/dist 文件夹下
```

### 目录结构

```shell
.
├── docs
│   ├── .vuepress (可选的)				// 用于存放全局的配置、组件、静态资源等
│   │   ├── components (可选的)		// 该目录中的 Vue 组件将会被自动注册为全局组件
│   │   ├── theme (可选的)				// 用于存放本地主题
│   │   │   └── Layout.vue
│   │   ├── public (可选的)			// 静态资源目录
│   │   ├── styles (可选的)			//  用于存放样式相关的文件
│   │   │   ├── index.styl				// 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级
│   │   │   └── palette.styl			// 用于重写默认颜色常量，或者设置新的 stylus 颜色常量
│   │   ├── templates (可选的, 谨慎配置)  // 存储 HTML 模板文件
│   │   │   ├── dev.html				// 用于开发环境的 HTML 模板文件
│   │   │   └── ssr.html				// 构建时基于 Vue SSR 的 HTML 模板文件
│   │   ├── config.js (可选的)			// 配置文件的入口文件，也可以是 YML 或 toml
│   │   └── enhanceApp.js (可选的)		// 客户端应用的增强
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json

```

#### 默认的页面路由

```shell
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}
# 在以上配置中，如命令
vuepress <command> targetDir [options]
# 中的 argetDir ，指定的目录路径为 docs
# 所以存在默认对应路由
文件路径   			|	页面路径
/README.md		   		/
/guide/README.md		/guide/
/config.md				/config.html
```

### 配置文件

配置文件分为  基本配置、主题配置、应用级别配置

- 基本配置 /docs/.vuepress/config.js
- 主题配置
- 应用级别配置 /docs/.vuepress/enhanceApp.js

// TODO



ps: 配置  主题  默认主题配置