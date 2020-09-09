# stream


## API for stream consumers

### 可写流 Writable streams

### 可读流 Readable streams

stream.Readable

#### 流动模式 & 暂停模式

可读流有**流动模式**和**暂停模式**两种模式
流动模式：数据从底层系统读取
暂停模式：必须显示调用stream.read()读取数据块

暂停模式 -> 流动模式：
- 添加 data 事件
- 调用 stream.resume() 方法
- 调用 stream.pipe() 方法将数据发送到可写流

流动模式 -> 暂停模式：
- 如果不是pipe，调用 stream.pause() 方法
- 如果是pipe，移除pipe。stream.unpip() 可以移除多个pipe

#### stream.Readable 类

##### 事件（event）

###### close

当流或其底层资源关闭时触发

###### data

###### end

###### error

###### pause

###### readable

###### resume
