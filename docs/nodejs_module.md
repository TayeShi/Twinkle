在nodejs中，一个文件即视为一个独立的模块

模块内本地的变量对外是不可见的

`module.exports`可以被一个新的值替换（如一个function或object）

模块系统在`require('module')`中实现

当直接从Node.js运行一个文件时，`require.main`被设置为这个module。 -> 可以通过`require.main === module`来判断文件是否被直接运行

在foo.js中，node foo.js 为 true，require('./foo.js')为false

通过`require.main.filename`可以获取当前程序的入口