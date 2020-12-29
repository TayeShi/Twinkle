## Linux

应用部署至  /home

环境安装至 /usr/local/src/.

环境bin /usr/local/bin



### 更改hostname 

```
hostname [new host name]
vim /etc/hostname
```

### 配置ip地址

vim /etc/sysconfig/network-scripts/ifcfg-ens33

```
bootproto="static"
onboot="yes"
IPADDR="192.168.100.100"
NETMASK="255.255.255.0"
GATEWAY="192.168.100.2"
DNS1="192.168.100.2"
DNS2="8.8.8.8"
```

```shell
# 重启网络
systemctl restart network
# 查看ip
ip addr
```
### 开启防火墙端口
```shell
# 开启端口
firewall-cmd --zone=public --add-port=80/tcp --permanent
# 查询端口是否开启
firewall-cmd --query-port=80/tcp
# 重启防火墙
firewall-cmd --reload
# 查询防火墙端口列表
firewall-cmd --list-port
firewall-cmd --list-all

# 关闭防火墙
systemctl stop firewalld.service
# 禁止firewall开机启动
systemctl disable firewalld.service
# 看默认防火墙状态（关闭后显示notrunning，开启后显示running）
firewall-cmd --state 

# --zone 作用域
# --add-port=80/tcp 添加端口，格式为：端口/通讯协议
# --permanent 永久生效，没有此参数重启后失效
```

### 用户相关

```shell
# 添加用户
adduser [username]
# 更改用户密码
passwd [username]
# 赋予用户root管理员权限
vim /etc/sudoers
[username]	ALL=(ALL)	ALL
# 更改用户文件权限
sudo chown [username]:[username] [dirpath] -R
```

### 服务器间推送文件
```shell
scp [-r] [username]@[servername]:[path] [username]@[servername]:[path]
scp [-r] from-server to-server
# 如果是本机，省略 username servername
```

## Deepin

```shell
# 修改初始root密码
sudo passwd
```

## Node

### 安装

```shell
cd /usr/local/src
wget https://npm.taobao.org/mirrors/node/v14.3.0/node-v14.3.0-linux-x64.tar.xz
tar xvf node-v14.3.0-linux-x64.tar.xz
# 命名文件夹
mv ./node-v14.3.0-linux-x64 ./nodejs
# 环境变量
# (方式1)
vi /ect/profile
export PATH=$PATH:/usr/local/nodejs/bin
source /etc/profile
# (方式2)
ln -s /usr/local/src/nodejs/bin/npm /usr/local/bin/
ln -s /usr/local/src/nodejs/bin/node /usr/local/bin/
# 检查是否安装成功
npm -v
node -v
```

### npm安装慢
```shell
# 临时使用
npm install xxx --registry https://registry.npm.taobao.org
# 永久使用
npm config set registry https://registry.npm.taobao.org
# 查看当前源
npm config get registry


#nvm
nvm node_mirror http://npm.taobao.org/mirrors/node/ # 注意结尾有斜杠
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
```


## Nginx


### 安装

1. 安装编译库

```shell
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

2. 安装pcre

```shell
cd /usr/local/src/
wget https://ftp.pcre.org/pub/pcre/pcre-8.44.tar.gz
tar zxvf pcre-8.44.tar.gz
cd pcre-8.44
# 编译安装
./configure
make && make install
# 查看pcre版本
pcre-config --version
```

3. 安装Nginx

```shell
cd /usr/local/src
wget http://nginx.org/download/nginx-1.18.0.tar.gz
tar zxvf nginx-1.18.0.tar.gz
cd nginx-1.18.0
./configure 
# or Nginx开启SSL模块 ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
make && make install
```
编译后，/usr/local下会出现nginx目录  sbin目录下有脚本

### nginx命令

```shell
# 查看nginx进程
ps -ef | grep nginx
# 查看版本
./nginx -v
# 开启
./nginx
# 关闭
./nginx -s stop
# 重新加载配置文件
./nginx -s reload
# 重启
./nginx -s reopen
```

### 配置nginx

配置文件地址 /usr/local/src/nginx-1.18.0/conf/   nginx.conf

```shell

```

## JDK

```shell
# 下载
wget https://download.oracle.com/otn-pub/java/jdk/14.0.1+7/664493ef4a6946b186ff29eb326336a2/jdk-14.0.1_linux-x64_bin.tar.gz?AuthParam=1594650050_ddf6eedabe57c2953a903c25f0b44f98
# 解压
tar zxvf [path]
# 配置环境变量
export JAVA_HOME=/usr/local/src/jdk-14.0.1
export CLASSPATH=$:CLASSPATH:$JAVA_HOME/lib/
export PATH=$PATH:$JAVA_HOME/bin/
# 刷新环境变量
source /etc/profile
```

## elasticsearch

```shell
# 安装
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.8.0-linux-x86_64.tar.gz
# 解压
tar -xvf elasticsearch-7.8.0-linux-x86_64.tar.gz
# 启动
cd elasticsearch-7.8.0/bin
./elasticsearch

# 不能以root身份启动
# 创建user
adduser elasticsearch
# 创建用户密码
passwd elasticsearch
# 把文件夹权限赋给创建的用户
chown -R elasticsearch ./elasticsearch-7.8.0
# 切换至创建的用户
su elasticsearch

# Enable CORS in elasticsearch 用于elasticsearch-head
# 配置elasticsearch.yml
http.cors.enabled: truenpm
http.cors.allow-origin: "*"
# 配置为外网可访问
# ./config/elasticsearch.yml
network.host: 0.0.0.0
discovery.seed_hosts: [] // 允许访问的IP列表
# ./config/jvm.options
-Xms128m
-Xmx128m
# /etc/sysctl.conf
vm.max_map_count=655360
# 配置生效
sysctl -p 
#  /etc/security/limits.conf
* soft nofile 65536
* hard nofile 65536
# reboot

# elasticsearch-head
git clone git://github.com/mobz/elasticsearch-head.git
cd elasticsearch-head
npm install
npm run start
open http://localhost:9100/
```

## Egg

```javascript
// 初始化项目
mkdir egg-example && cd egg-example
npm init egg --type=simple
npm i
```

## Hadoop

### 配置Hadoop环境

```shell
export HADOOP_HOME=/home/modules/hadoop-3.3.0
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
```
配置集群 host列表 IP hostname 防火墙