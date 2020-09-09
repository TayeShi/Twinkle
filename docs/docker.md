# docker

## install

## 命令

### 镜像命令

#### docker images
```shell
docker images [options] 列出本地的镜像
options:
	-a: 列出本地所有的镜像（含中间映像层）
	-q: 只显示镜像ID
	--digests: 显示镜像的摘要信息
	--no-trunc: 显示完整的镜像信息
```
![docker-docker-images](E:\S\MyGitHub\Twinkle\docs\docker.assets\docker-docker-images.png)
- REPOSITORY：镜像的仓库源
- TAG：镜像的版本标签
- IMAGE ID：镜像ID
- CREATED：镜像创建的时间
- SIZE：镜像的大小
如果不指定TAG，默认为 XXX:latest

### 容器命令