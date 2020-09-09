# events

## EventEmitter类

```javascript
const EventEmitter = require('events')
```

events模块中默认导出EventEmitter类
添加新的监听器时，所有EventEmitter类触发newListener事件
移除监听器时，所有EventEmitter类触发removeListener事件

导入时可选参数：

```javascript
const EventEmitter = require('events', {
	captureRejections: false // 是否自动捕获Promise中的reject 默认false
})
```

### 事件（Event）

#### newListener

eventName
listener
添加一个新的事件前，会触发newListener事件

```javascript
const EventEmitter = require('events', {captureRejections: true})

class MyEmitter extends EventEmitter{}

const myEmmiter = new MyEmitter()

myEmmiter.once('newListener', (eventName, err) => {
  if (eventName === 'event') {
    myEmmiter.once('event', () => {
      console.log('B')
    })
  }
})
myEmmiter.on('event', () => {
  console.log('A')
})

myEmmiter.emit('event')

// B
// A
```

#### removeListener

eventName
listener
removeListener在listener移除后触发

### 变量

#### defaultMaxListeners

defaultMaxListeners 可以改变每个事件可以注册的lisener的数量，默认10个
更改defaultMaxListeners会更改所有实例对应的数量，一般不直接修改此参数，一般使用emiiter.setMaxListeners进行更改

#### errorMonitor

### 方法

#### emitter.addListener(eventName, listener)

同 emitter.on(eventName, listener)