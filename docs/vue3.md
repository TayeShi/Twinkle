# vue3



## 组合式API

### 什么是组合式API

随着应用功能越复杂，页面/组件代码越来越多。导致碎片化，开发跳来跳去不易维护。组合式API使同一逻辑点代码配置在一起。

### setup 组件选项

**`setup`组件选项在创建组件之前执行**

```typescript
export default defineComponent({
  created () {
    console.log('created...')
  },
  mounted () {
    console.log('mounted...')
  },
  setup () {
    /**
     * setup会在 创建组件之前 执行。
     */
    console.log('setup...')
  }
})

/**
 * setup...
 * created...
 * mounted...
 */
```

> Note:
> 1. 在组件创建之前调用。比created还早。所以只执行一次。
> 2. 由于1原因，所以this不可调用。
> 3. setup返回的所有内容都将暴露给组件的其他部分。 
>   1. return {} 返回的是一个对象，可以直接在模板中使用其中的属性和方法。
>   2. 返回对象的属性会合并到组件的data中
>   3. 返回的方法会合并到methods方法中
>   4. 如果有重名，setup中的优先

```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      msg: 'lalala' // 7. 重名会被setup中的内容覆盖
    }
  },
  methods: {
    show () {
      console.log('show in methods...')
    }
  },
  created () {
    console.log('created...')
  },
  mounted () {
    console.log('mounted...')
    // console.log(this.$data)
    console.log(this) // 3. 在this中可以看到msg,和show。可供模板直接调用
  },
  setup (props, context) {
    /**
     * 1. setup会在 创建组件之前 执行。
     */
    console.log('setup...')
    console.log('setup this', this) // 2. this是一个undefined

    console.log('props:', props)
    console.log('context:', context)

    function show () {
      console.log('show function()')
    }

    const msg = 'hahaha'
    // 4. 模板返回一个对象
    return {
      /**
       * setup会覆盖data&method中的重名内容
       */
      // eslint-disable-next-line vue/no-dupe-keys
      msg,
      // eslint-disable-next-line vue/no-dupe-keys
      show
    }
  }
})
```



## temp

使用和不使用 vue-class-component

ref
reactive
vue2和vue3响应式的区别 Object.defineProperty  Proxy和Reflect
在setup中加入生命周期hook

计算属性和监视

Vue2 和 vue3 的生命周期对比，以及vue3新增的hook

view的生命周期
组件的生命周期