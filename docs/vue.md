# vue

## 1

###

#### 声明式渲染

1. 文本插值 `{message}}`
2. 绑定元素属性`v-bind`

#### 处理用户输入

1. `v-on`附加事件侦听器
2. `v-model`双向绑定

#### 条件和循环

1. `v-if`
2. `v-for`

### 应用实例

#### 创建一个实例

```typescript
Vue.createApp(/* options */).mount('#app')
```

#### 数据与方法

```typescript
/**
 * 如果以后需要一个属性，但该属性开始为空或不存在，需要设置初始值。
 * data中的某项属性更改的时候，视图中也会更新
 * data中的属性仅在创建实例时存在时才更新视图
 */
data () {
	return {
		newTodoText: '',
        visitCount: 0,
        hideCompletedTodos: false,
        todos: [],
        error: null
	}
}

/**
 * 使用 Object.freeze(),防止更改现有属性,vue也无法跟踪更改视图
 */
const obj = {
  foo: 'bar'
}
Object.freeze(obj)
const vm = Vue.createApp({
  data() {
    return obj
  }
}).mount('#app')

/**
 * 其他的实例属性和方法 前缀$
 * 如：vm.$data.a
 */
const vm = Vue.createApp({
  data() {
    return {
      a: 1
    }
  }
}).mount('#example')
vm.$data.a // => 1
```

#### Instance Lifecycle Hooks 实例生命周期Hooks

每个实例在创建的时候，会执行生命周期Hooks，此时便有机会在特定阶段添加自己的代码
如：创建实例后，可以使用 created hook

```typescript
Vue.createApp({
  data() {
    return {
      a: 1
    }
  },
  created() {
    // `this` points to the vm instance
    console.log('a is: ' + this.a) // => "a is: 1"
  }
})
```

在实例生命周期还有其他的`hooks`，如`mount`、`update`、`unmount`
调用生命周期hooks的时候，他们的`this`指向调用他的当前的活动实例

> 不要在`an options property`或回调函数使用箭头函数

#### 生命周期图

`beforeCreate`，`created`，`beforeMount`，`mounted`，`beforeUpdate`，`updated`，`beforeUnmount`，`unmounted`

![实例生命周期挂钩](https://v3.vuejs.org/images/lifecycle.png)

### 模板语法

#### 模板中插入数据

##### {{message}}

```vue
<span>Message: {{ msg }}</span>
// 只渲染一次，不会虽数据更改
<span v-once>This will never change: {{ msg }}</span>
```

##### v-html 原始html

```vue
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

##### v-bind:attr 属性

##### javascript表达式

#### 指令 `v-xxx`

`v-if`，`v-for`，`v-bind`，`v-on`，`v-model`，等等

`v-bind:xxx` -> `:xxx`
`v-on:xxx` -> `@xxx`

### 计算属性和观察者

#### 计算属性

```typescript
computed: {
	return this.author.books.length > 0 ? 'Yes' : 'No'
}
```

#### 观察者

当您要执行**异步**或**昂贵**的操作以响应更改的数据时，此功能非常有用。
`$watch`

```typescript
watch: {
      // whenever question changes, this function will run
      question(newQuestion, oldQuestion) {
        if (newQuestion.indexOf('?') > -1) {
          this.getAnswer()
        }
      }
    },
```

