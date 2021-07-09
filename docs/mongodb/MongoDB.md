# MongoDB

## install

### yum方式安装

1. 创建一个`/etc/yum.repos.d/mongodb-org-4.2.repo`文件

```shell
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```

2. 安装4.2版本的最新版

```shell
sudo yum install -y mongodb-org
```

3. 运行MongoDB社区版

**使用默认目录运行**

默认情况下，MongoDB使用`mongod`账户运行。
yum安装后，默认的使用的目录为：
- `/var/lib/mongo` (数据目录)
- `/var/log/mongodb` (目录日志)

如果是下载压缩包安装，则需要手动创建目录

**自定义目录运行**

创建需要的目录，并给目录赋予MongoDB用户权限
配置`/etc/mongod.conf`文件：
- `storage.dbPath`指定新的数据目录地址
- `systemLog.path`指定新的目录日志地址

#### 运行过程中的报错

运行 `systemctl start mongod` 报错 

```javascript
Job for mongod.service failed because the control process exited with error code.
See "systemctl status mongod.service" and "journalctl -xe" for details.
```

查看`/var/log/mongod`日志文件

```javascript
Failed to unlink socket file /tmp/mongodb-27017.sock Operation not permitted
```

删除`/tmp/mongodb-27017.sock`，

> 原因 `kill -9` 杀死进程导致的

#### 添加用户验证

```shell
# 增加一个admin
use admin
db.createUser(
  {
    user: "myUserAdmin",
    pwd: passwordPrompt(), // or cleartext password
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

# 配置开启auth /etc/mongod.conf
security:
    authorization: enabled

# 重启MongoDB
systemctl restart mongod

# 连接MongoDB
mongo -u username 

# 验证身份
use admin
db.auth("myUserAdmin", passwordPrompt()) // or cleartext password
```

#### 根据部署创建其他用户
use test
db.createUser(
  {
    user: "myTester",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "reporting" } ]
  }
)

