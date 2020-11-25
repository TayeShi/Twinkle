# hadoop

## Hadoop环境搭建

### 虚拟机环境准备

1. 克隆虚拟机

2. 修改克隆虚拟机的静态IP
    ```shell
    vim /etc/sysconfig/network-scripts/ifcfg-ens33
    ```

3. 修改主机名

   ```shell
   vim /etc/hostname
   ```

   ```shell
   vim /etc/host
   
   192.168.100.101 hadoop101
   192.168.100.102 hadoop102
   192.168.100.103 hadoop103
   192.168.100.104 hadoop104
   192.168.100.105 hadoop105
   192.168.100.106 hadoop106
   192.168.100.107 hadoop107
   192.168.100.108 hadoop108
   192.168.100.109 hadoop109
   ```

4. 关闭防火墙

    ```shell
    # 关闭防火墙
    systemctl stop firewalld.service
    # 禁止firewall开机启动
    systemctl disable firewalld.service
    ```

5. 创建 hadoop 用户

6. 配置 hadoop 用户具有的root权限

7. 在`/opt`目录下创建文件夹

    ```shell
    # /opt/software 存放jar包
    # /opt/module   存放解压后的jar包
    
    # 修改文件夹权限
    sudo chown hadoop:hadoop /opt/software /opt/module
    ```

### 安装JDK

### 安装Hadoop



### 案例

#### 官方案例

##### 独立运行

```shell
# 基于hadoop目录
# 将etc/hadoop/*.xml 下的文件进行统计，统计出符合正则表达式的内容数量
mkdir input
cp etc/hadoop/*.xml input
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.0.jar grep input output 'dfs[a-z.]+'
cat output/*
# 完成后在output目录下生成 part-r-00000 _SUCCESS

# 输出内容
# 1 dfsadmin
```

###### WordCount案例

```shell
# WordCount案例
mkdir wcinput
cd wcinput
touch wc.input
vim wc.input

# 数据准备
hadoop yarn
hadoop mapreduce
hadoop101
hadoop101

:wq!

# 执行程序
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.0.jar wordcount wcinput wcoutput

# 查看结果
cat wcoutput/part-r-00000 # cat wcoutput/*

# log
hadoop  2
hadoop101       2
mapreduce       1
yarn    1
```

##### 伪分布式运行模式

###### 启动hdfs并运行MapReduce程序

```shell
# 1. 更改配置  {hadoop}/etc/hadoop/*
# 1.1 core-site.xml
    <!-- 指定HSFS中NameNode的地址 -->
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://hadoop101:9000</value>
    </property>

    <!-- 指定Hadoop运行时产生文件的存储目录 -->
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/opt/module/hadoop-3.3.0/data/tmp</value>
    </property>
    
# 1.2 hdfs-site.xml
    <!-- 指定HDFS副本的数量 -->
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
# 1.3 hadoop-env.sh
    JAVA_HOME=''

# 2. 启动

# 2.1 初始化(仅第一次执行一次)
bin/hdfs namenode -format
# 2.2 启动namenode
sbin/hadoop-daemon.sh start namenode        
# 2.3 启动datanode
sbin/hadoop-daemon.sh start datanode
# 以上建议： sbin/start-dfs.sh     或  hdfs --daemon start      
# 2.4 查看是否启动
jps
# 查看浏览器 192.168.100.101:9870

# 3. 文件操作及运行案例
# 3.1 创建文件
bin/hdfs dfs -mkdir -p /user/hadoop/input
bin/hdfs dfs -ls /
# 3.2 上传文件到hdfs
bin/hdfs dfs -put wcinput/wc.input /user/hadoop/input
# 3.3 执行wordcount
bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.0.jar wordcount /user/hadoop/input /user/hadoop/output
# 3.4 查看执行结果
bin/hdfs dfs -cat /user/hadoop/output/p*
```

**其他注意**

```shell
# 如果执行初始化
1.停掉namenode和datanode
2.删除hadoop目录下的data和logs目录

# log日志查看
{hadoop}/logs目录下
```



```shell
启动yarn 并运行MapReduce程序

配置yarn-env.sh
JAVA_HOME=''
yarn-site.xml

<!-- Reducer获取数据的方式 -->
<property>
	<name>yarn.nodemanager.aux-services</name>
	<value>mapreduce_shuffle</value>
</property>

<!-- 指定yarn的ResourceManager的地址 -->
<property>
	<name>yarn.resourcemanager.hostname</name>
	<value>hadoop101</value>
</property>

mapred-env.sh
JAVA_HOME=''
mapred-site.xml.template -> mapred-site.xml

<!-- 指定MR运行在YARN上 -->
<property>
	<name>mapreduce.framework.name</name>
	<value>yarn</value>
</property>

启动 启动前必须保证NameNode和DataNode已经启动
启动ResourceManager
sbin/yarn-daemon.sh start resourcemanager
启动NodeManager
sbin/yarn-daemon.sh start nodemanager

http://hadoop101:8088/cluster

启动任务
bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.0.jar wordcount /user/hadoop/input /user/hadoop/output
则在8088上可以看见任务信息




# 错误处理
yarn执行MapReduce任务时，找不到主类导致的
 错误: 找不到或无法加载主类 org.apache.hadoop.mapreduce.v2.app.MRAppMaster
 
 hadoop classpath 获取到内容
 复制，填写到yarn-site.xml
 <property>
        <name>yarn.application.classpath</name>
        <value>/opt/module/hadoop/etc/hadoop:/opt/module/hadoop/share/hadoop/common/lib/*:/opt/module/hadoop/share/hadoop/common/*:/opt/module/hadoop/share/hadoop/hdfs:/opt/module/hadoop/share/hadoop/hdfs/lib/*:/opt/module/hadoop/share/hadoop/hdfs/*:/opt/module/hadoop/share/hadoop/mapreduce/lib/*:/opt/module/hadoop/share/hadoop/mapreduce/*:/opt/module/hadoop/share/hadoop/yarn:/opt/module/hadoop/share/hadoop/yarn/lib/*:/opt/module/hadoop/share/hadoop/yarn/*</value>
</property>

重启
yarn --daemon stop resourcemanager
yarn --daemon stop nodemanager

yarn --daemon start resourcemanager
yarn --daemon start nodemanager

```

```shell
配置历史服务器

mapred-site.xml
<!-- 历史服务器端地址 -->
<property>
	<name>mapreduce.jobhistory.address</name>
	<value>hadoop101:10020</value>
</property>
<!-- 历史服务器web端地址 -->
<property>
	<name>mapreduce.jobhistory.webapp.address</name>
	<value>hadoop101:19888</value>
</property>

启动历史服务器
sbin/mr-jobhistory-daemon.sh start historyserver

jps
```

```shell
配置日的志聚集

日志聚集的概念：应用运行完成以后，将程序运行日志信息上传到HSFS系统上
日志聚集的好处：可以方便地查看到程序性运行详情，方便开发调试

# 开启日志聚集功能，需要重新启动NodeManager，ResourceManager，HistoryManager

配置yarn-site.xml
<!-- 日志聚集功能使能 -->
<property>
	<name>yarn.log-aggregation-enable</name>
	<value>true</value>
</property>
<!-- 日志保留时间设置7天 -->
<property>
	<name>yarn.log-aggregation.retain-seconds</name>
	<value>604800</value>
</property>

关闭 NodeManager，ResourceManager，HistoryManager
sbin/yarn-daemon.sh stop resourcemanager
sbin/yarn-daemon.sh stop nodemanager
sbin/mr-jobhistory-daemon.sh stop historyserver

启动 NodeManager，ResourceManager，HistoryManager
sbin/yarn-daemon.sh start resourcemanager
sbin/yarn-daemon.sh start nodemanager
sbin/mr-jobhistory-daemon.sh start historyserver

删除再重新运行，再8088到history查看MapReduce的logs
```

配置文件说明

Hadoop配置文件分为两类：默认配置文件和自定义配置文件，想修改某一默认配置值时，修改自定义配置文件即可。

默认配置文件：

|  要获取的默认文件  |             文件存放在Hadoop的jar包中的位置             |
| :----------------: | :-----------------------------------------------------: |
|  core-default.xml  |       hadoop-common-version.jar/core-default.xml        |
|  hdfs-default.xml  |          hadoop-hdfs-version/hdfs-default.xml           |
|  yarn-default.xml  |       hadoop-yarn-common-version/yarn-default.xml       |
| mapred-default.xml | hadoop-mapreduce-client-core-version/mapred-default.xml |

自定义配置文件`core-site.xml`、`hdfs-site.xml`、`yarn-site.xml`、`mapred-site.xml`四个配置文件存放在`$HADOOP_HOME/etc/hadoop`路径上，用户在此目录下进行修改配置



///--------------------------------------- 完全分布式 ！！！

1.环境准备

2.编写集群分发脚本xsync

2.1. scp拷贝hadoop环境到其他服务器

scp(secure copy) 安全拷贝
scp 可以从其他计算机上拷贝到本机，也可以从本机拷贝到其他计算机
scp -r [from] [to]
用户名@主机名:拷贝到的路径/名称

2.2. 编写集群分发脚本xsync

rsync 远程同步工具，主要用于备份和镜像。具有速度快、避免复制相同内容和支持符号链接的优点
rsync 和 scp 的区别：用rsync做文件的复制要比scp的速度快，rsync只对差异文件做更新。scp是把所有文件都复制过去。

基本语法：
rsync [选项参数] [要拷贝的文件路径/名称] [目的用户@主机名:目的路径/名称]
选项参数：
- -r 递归
- -v 显示复制过程
- -l 拷贝符号连接
example: rsync -rvl /opt/software root@hadoop102:/opt/software

2.3 xsync 集群分发脚本

期望效果: xsync 要同步的文件或文件夹名称
在/home/$username/bin下的脚本 $username用户在系统任何地方都可以直接执行

```shell
# /home/$username/bin
# vim xsync

#!/bin/bash
#1 获取输入参数的个数，如果没有参数，直接退出
pcount=$#
if((pcount==0)); then
echo no args;
exit;
fi

#2 获取文件名称
p1=$1
fname=`basename $p1`
echo fname=$fname

#3 获取上级目录到绝对路径
pdir=`cd -P $(dirname $p1); pwd`
echo pdir=$pdir

#4 获取当前用户
user=`whoami`

#5 循环 从hadoop102开始做集群
for((host=103; host<105; host++)); do
	echo ---------- hadoop$host ----------
	rsync -rvl $pdir/$fname $user@hadoop$host:$pdir
done

# chmod 777 xsync

# xsync /home/hadoop/bin
```

3.集群配置

3.1 集群部署规划

|      |       hadoop102        |            hadoop103             |            hadoop104            |
| :--: | :--------------------: | :------------------------------: | :-----------------------------: |
| HDFS | NameNode<br />DataNode |             DataNode             | SecondaryNameNode<br />DataNode |
| YARN |      NodeManager       | ResourceManager<br />NodeManager |           NodeManager           |

3.2 配置

3.2.1 core配置

core-site.xml

```xml
<!-- 指定HDFS中NameNode的地址 -->
<property>
	<name>fs.defaultFS</name>
    <value>hdfs://hadoop102:9000</value>
</property>
<!-- 指定Hadoop运行时产生文件的存储目录 -->
<property>
	<name>hadoop.tmp.dir</name>
    <value>/opt/module/hadoop-3.0.0/data/tmp</value>
</property>
```

3.2.2 HDFS配置

hadoop-env.sh

```shell
export JAVA_HOME=/opt/module/jdk...
```

hdfs-site.sh

```xml
<property>
	<name>dfs.replication</name>
	<value>3</value>
</property>
<!-- 指定Hadoop辅助名称节点主机配置 -->
<property>
	<name>dfs.namenode.secondary.http-address</name>
    <value>hadoop104:50090</value>
</property>
```

3.2.3 YARN配置

yarn-env.sh

```shell
export JAVA_HOME=/opt/module/jdk...
```

yarn-site.xml

```xml
<!-- Reducer获取数据的方式 -->
<property>
	<name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
</property>
<!-- 指定YARN的ResourceManager的地址 -->
<property>
	<name>yarn.resourcemanager.hostname</name>
    <value>hadoop103</value>
</property>
```

3.2.4 MapReduce配置

mapred-env.sh

```shell
export JAVA_HOME=/opt/module/jdk...
```

mapred-site.xml

```xml
<property>
	<name>mapreduce.framework.name</name>
    <value>yarn</value>
</property>
```

3.3 分发以上配置到 103 104

xsync  /opt/module/hadoop-3.3.0/

3.4 验证分发情况

4.集群单节点启动

删除所有节点 $hadoop 下的 data/ logs/

hadoop102 
bin/hdfs namenode -format
sbin/hadoop-daemon.sh start namenode
sbin/hadoop-daemon.sh start datanode

hadoop103
sbin/hadoop-daemon.sh start datanode

hadoop104
sbin/hadoop-daemon.sh start datanode