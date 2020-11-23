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

