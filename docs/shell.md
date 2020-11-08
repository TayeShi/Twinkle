# shell

## shell 解析器

```shell
# 1.查看Linux提供的解析器
cat /etc/shells
# 结果如下:
# [root@server150 bin]# cat /etc/shells
# /bin/sh
# /bin/bash
# /usr/bin/sh
# /usr/bin/bash

# 2.bash 和 sh 的关系
ll | grep bash
# [root@server150 bin]# ll | grep bash
# -rwxr-xr-x. 1 root root     1219248 11月  8 2019 bash
# lrwxrwxrwx. 1 root root          10 11月  8 2019 bashbug -> bashbug-64
# -rwxr-xr-x. 1 root root        7348 11月  8 2019 bashbug-64
# lrwxrwxrwx. 1 root root           4 11月  8 2019 sh -> bash

# 3.查看默认的解析器
echo $shell
# [root@server150 ~]# echo $SHELL
# /bin/bash
```

## Shell脚本

### demo-1

helloworld

```shell
cd /home/shells
touch helloworld.sh
vim helloworld.sh

# helloworld.sh
#!/bin/bash
echo "helloworld"

# exec
bash ./helloworld.sh
./helloworld.sh
# ./helloworld.sh 需要更改权限 chmod 777
# bash (file)   是通过bash调用文件
# (file) 是直接调用文件，所以需要文件具有执行权限
```

### demo-2

在`/home`下创建一个**test.txt**，并在**test.txt**中增加 "helloworld!"

```shell
cd /home/shells
touch demo2.sh
vim demo2.sh

# demo2.sh
#!/bin/bash
cd /home
touch test.txt
echo "helloworld" >> test.txt
```



### 变量

#### 系统变量

```shell
$HOME	# 系统home变量
$PWD	# 当前目录
$USER	# 当前user
$SHELL
```

#### 自定义变量

```shell
# 定义
A="haha"
echo $A # haha
# = 两边不能有空格

# 取消
unset A
echo $A # 

# 声明静态变量
readonly B=3
echo $B #3
unset B # 报错，readonly
```

- 变量名最好大写
- 等号两边不能有空格
- 变量默认类型都是字符串类型，不能进行计算
- 如果有空格，需要用双引号和单引号包起来

#### 提升为全局变量

```shell
C="lalala"
export C
```

#### 特殊变量

##### $n

`$n` 表示命令的输入参数 

`$0` 为执行的文件名（脚本文件）

`$1` ~ `$9` 第一个到第九个参数 第十个以上的参数需要加大括号 `${11}`

```shell
# demo3.sh
#!/bin/bash
echo "$0 $1 $2 $3"

#exec
./demo3.sh a b c d e
# 输出: ./demo3.sh a b c
```

##### $#

`$#` 表示输入参数的个数

```shell
# demo4.sh
#!/bin/bash
echo "$#"

./demo4.sh		# 0
./demo4.sh a b	# 2
```

##### $* $@

`$#` 表示所有输入的参数，（整体对待）

`#@` 也表示所有输入的参数，（区别对待）

##### #?

`$?` 表示上一条命令是否正确执行，为 0 表示正常执行，不为 0 表示没有正常执行