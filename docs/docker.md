# docker

## install

```shell
# 一键安装
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
# or
curl -sSL https://get.daocloud.io/docker | sh

# 启动docker
sudo systemctl start docker
```



## 命令

### 镜像命令

#### docker images 列出本地镜像
```shell
docker images [options] 列出本地的镜像
options:
	-a: 列出本地所有的镜像（含中间映像层）
	-q: 只显示镜像ID
	--digests: 显示镜像的摘要信息
	--no-trunc: 显示完整的镜像信息
```
![docker-docker-images](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/docker-docker-images.png)
- REPOSITORY：镜像的仓库源
- TAG：镜像的版本标签
- IMAGE ID：镜像ID
- CREATED：镜像创建的时间
- SIZE：镜像的大小
如果不指定TAG，默认为 XXX:latest

#### docker search 查询hub.docker.com上的镜像
```shell
docker search [options] XXX 查询hub.docker.com上的镜像
options:
	--no-trunc: 显示完整的镜像描述
	-s: 列出收藏数不小于指定值的镜像
	--automated: 只列出automated build类型的镜像
```

#### docker pull XXX 取镜像

```shell
docker pull XXX
# XXX[:TAG] 镜像名字
```

#### docker rmi XXX_ID 删除镜像

```shell
# 删除单个镜像
docker rmi -f 镜像ID
# 删除多个镜像
docker rmi -f 镜像名[:TAG] 镜像名2[:TAG]
# 删除全部镜像
docker rmi -f ${docker images -qa}
```

#### docker commit 提交容器副本使之成为一个新的镜像

```shell
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名[:TAG名]
```

### 容器命令

#### docker run [options] IMAGE [command] [arg..] 新建并启动容器

```shell
docker run [options] IMAGE [command] [arg...] 新建并启动容器
options:
	--name="myname": 为容器指定一个名称
	-d: 后台运行容器，并返回容器ID，即启动守护式容器 # 常用重点
	-i: 为容器分配一个伪输入终端，通常与-i同时使用 # 常用重点
	-P: 随机端口映射
	-p: 指定端口映射，有以下四种格式：
		ip:hostPort:containerPort
		ip::containerPort
		hostPort:containerPort # 常用重点
		containerPort
		
	–restart=always : 随docker启动而启动
		
# 交互式容器 eg:
docker run -it centos /bin/bash
# 使用镜像centos:latest以交互式启动一个容器，并在容器内执行/bin/bash命令
```

#### 列出所有正在运行的容器

```shell
docker ps [options] 列出当前正在运行的容器
options:
	-a: 列出当前所有正在运行的容器 & 历史上运行过的容器
	-i: 显示最近创建的容器
	-n: 显示最近n个创建的容器
	-q: 静默模式，只显示容器编号
	--no-trunc: 不截断输出
```

#### 退出容器

```shell
# 容器停止且退出
exit

# 容器不停止且退出
ctrl+P+Q
```

#### 启动容器

```shell
docker start 容器ID或容器名
```

#### 重启容器

```shell
docker restart 容器ID或容器名
```

#### 停止容器

```shell
docker stop 容器ID或容器名
```

#### 强制停止容器

```shell
docker kill 容器ID或容器名
```

#### 删除已经停止的容器

```shell
# 删除单个容器
docker rm 容器ID或容器名
# 删除多个容器
docker rm -f $(docker ps -a -q)
# 或
docker ps -a -q | xargs docker rm
```

#### 其他容器相关命令

```shell
# 查看容器日志
docker logs -f -t --tail 容器ID
# -t 加入时间戳
# -f 跟随最新的日志打印
# --tail 数字显示最后多少条

# 查看容器内部运行的进程
docker top 容器ID

# 查看容器内部细节
docker inspect 容器ID

# 进入正在运行的容器并以命令行交互
docker exec -it 容器ID bashShell # eg: docker exec -it XXX /bin/bash
# 重新进入
docker attach 容器ID
# attach 和 exec 区别
# attach 直接进入容器启动命令的终端，不会启动新的进程
# exec 在容器中打开新的终端，并且可以启动新的进程


# 从容器内拷贝文件到主机上
docker cp 容器ID:容器内路径 目的主机路径
# eg: docker cp XXX:/usr/local/mycptest/aaa.text /tmp/aaa.txt
```

#### 常用命令

![command](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/docker-command.png)

```shell
attach    Attach to a running container                 # 当前 shell 下 attach 连接指定运行镜像
build     Build an image from a Dockerfile              # 通过 Dockerfile 定制镜像
commit    Create a new image from a container changes   # 提交当前容器为新的镜像
cp        Copy files/folders from the containers filesystem to the host path   #从容器中拷贝指定文件或者目录到宿主机中
create    Create a new container                        # 创建一个新的容器，同 run，但不启动容器
diff      Inspect changes on a container's filesystem   # 查看 docker 容器变化
events    Get real time events from the server          # 从 docker 服务获取容器实时事件
exec      Run a command in an existing container        # 在已存在的容器上运行命令
export    Stream the contents of a container as a tar archive   # 导出容器的内容流作为一个 tar 归档文件[对应 import ]
history   Show the history of an image                  # 展示一个镜像形成历史
images    List images                                   # 列出系统当前镜像
import    Create a new filesystem image from the contents of a tarball # 从tar包中的内容创建一个新的文件系统映像[对应export]
info      Display system-wide information               # 显示系统相关信息
inspect   Return low-level information on a container   # 查看容器详细信息
kill      Kill a running container                      # kill 指定 docker 容器
load      Load an image from a tar archive              # 从一个 tar 包中加载一个镜像[对应 save]
login     Register or Login to the docker registry server    # 注册或者登陆一个 docker 源服务器
logout    Log out from a Docker registry server          # 从当前 Docker registry 退出
logs      Fetch the logs of a container                 # 输出当前容器日志信息
port      Lookup the public-facing port which is NAT-ed to PRIVATE_PORT    # 查看映射端口对应的容器内部源端口
pause     Pause all processes within a container        # 暂停容器
ps        List containers                               # 列出容器列表
pull      Pull an image or a repository from the docker registry server   # 从docker镜像源服务器拉取指定镜像或者库镜像
push      Push an image or a repository to the docker registry server    # 推送指定镜像或者库镜像至docker源服务器
restart   Restart a running container                   # 重启运行的容器
rm        Remove one or more containers                 # 移除一个或者多个容器
rmi       Remove one or more images             # 移除一个或多个镜像[无容器使用该镜像才可删除，否则需删除相关容器才可继续或 -f 强制删除]
run       Run a command in a new container              # 创建一个新的容器并运行一个命令
save      Save an image to a tar archive                # 保存一个镜像为一个 tar 包[对应 load]
search    Search for an image on the Docker Hub         # 在 docker hub 中搜索镜像
start     Start a stopped containers                    # 启动容器
stop      Stop a running containers                     # 停止容器
tag       Tag an image into a repository                # 给源中镜像打标签
top       Lookup the running processes of a container   # 查看容器中运行的进程信息
unpause   Unpause a paused container                    # 取消暂停容器
version   Show the docker version information           # 查看 docker 版本号
wait      Block until a container stops, then print its exit code   # 截取容器停止时的退出状态值
```

### 容器数据卷

将宿主机目录挂在到容器目录     容器间继承，共享数据，容器持久化

#### 命令添加数据卷

```shell
docker run -it -v /宿主机绝对路径目录:/容器内目录 镜像名

# 查看数据卷是否挂在成功
docker inspect 容器ID

# 带权限的命令
docker run -it -v /宿主机绝对路径目录:/容器内目录:ro 镜像名
```

#### Dockerfile添加数据卷

```shell
# Dockerfile
VOLUME["/dataVolumeContainer","/dataVolumeContainer2","/dataVolumeContainer3"]

# Docker挂载主机目录Docker访问出现cannot open directory .: Permission denied
# 解决办法：在挂载目录后多加一个--privileged=true参数即可
```

### Dockerfile

编写Dockerfile文件 -> docker build -> docker run

![docker-centos-Dockerfile](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/docker-centos-Dockerfile.png)

1. 每条保留字指令都必须为大写字母且后面要跟随至少一个参数
2. 指令按照从上到下，顺序执行
3. #表示注释
4. 每条指令都会创建一个新的镜像层，并对镜像进行提交

Docker执行Dockerfile的大致流程：
1. docker从基础镜像运行一个容器
2. 执行一条指令并对容器作出修改
3. 执行类似docker commit的操作提交一个新的镜像层
4. docker再基于刚提交的镜像运行一个新容器
5. 执行dockerfile中的下一条指令直到所有指令都执行完成

#### Dockerfile体系结构（保留字指令）

##### **`FROM`** 基础镜像，当前新镜像是基于哪个镜像的
##### **`MAINTAINER`** 镜像维护者的姓名和邮箱地址
##### **`RUN`** 容器构建时需要运行的命令
##### **`EXPOSE`** 当前容器对外暴露出的端口
##### **`WORKDIR`** 指定在创建容器后，终端默认登陆的进来工作目录，一个落脚点
##### **`ENV`** 用来在构建镜像过程中设置环境变量 
##### **`ADD`** 将宿主机目录下的文件拷贝进镜像且ADD命令会自动处理URL和解压tar压缩包
##### **`COPY`** 类似ADD，拷贝文件和目录到镜像中。
将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置
- COPY src dest
- COPY ["src", "dest"]
##### **`VOLUME`** 容器数据卷，用于数据保存和持久化工作
##### **`CMD`** 指定一个容器启动时要运行的命令
`CMD`命令格式`RUN`相似，也是两种格式：
- `shell`格式：`CMD <命令>`
- `exec`格式：`CMD ["可执行文件","参数1","参数2"]`
Dockerfile 中可以有多个 CMD 指令，但只有最后一个生效，CMD 会被 docker run 之后的参数替换
##### **`ENTRYPOINT `** 指定一个容器启动时要运行的命令， ENTRYPOINT 的目的和 CMD 一样，都是在指定容器启动程序及参数
##### **`ONBUILD`** 当构建一个被继承的Dockerfile时运行命令，父镜像在被子继承后父镜像的onbuild被触发

#### ![docker-command](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/docker-command.png)


### Demo

#### mysql

```shell
docker pull mysql
# 启动并设置密码
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
#启动
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456! -d mysql

#进入容器
docker exec -it mysql bash

#登录mysql
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Lzslov123!';

```

#### redis

```shell
docker pull redis

docker run -itd --name redis -p 6379:6379 redis

docker run --name myredis -p 6379:6379 -d --restart=always redis:latest redis-server --appendonly yes --requirepass "root123456"
# -p 6379:6379 :将容器内端口映射到宿主机端口(右边映射到左边)
# redis-server –appendonly yes : 在容器执行redis-server启动命令，并打开redis持久化配置
# requirepass “your passwd” :设置认证密码
# –restart=always : 随docker启动而启动


```

