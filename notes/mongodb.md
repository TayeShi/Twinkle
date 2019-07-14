# MongoDB笔记

### 概念

数据库（database）

集合（collection）

文档（document）

### 启动

sudo mongod
    
启动MongoDB服务

mongo

进入MongoDB终端

### 基本指令

show dbs  
show databases  
  显示当前的所有数据库

use 数据库名  
  进入到指定的数据库中

db
  显示当前使用的数据库

show collections
  显示数据库中所有的集合

### CRUD操作

db.\<collection\>.insert(doc)  
  向数据库中插入一个文档  
  例子： db.test.insert({aaa:'aaa'})

db.\<collection\>.find()
  查询当前集合中的所有文档  
  

