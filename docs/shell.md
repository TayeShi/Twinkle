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

### 运算符

```shell
# 第一种 $((运算式))  or  $[运算式]
# 第二种 expr 运算式
# expr 的 运算式 运算符间要有空格

expr 3 + 2
# (3+2)*4
expr `expr 3 + 2` \* 4

$(((3+2)*4))
$[(3+2)*4]
```

### 条件判断

```shell
# [ condition ]     condition前后要有空格
# 条件condition非空即为 true, [ aaa ] 返回 true, [] 返回false

# 1. 两个整数间比较

#  = 字符串间比较
#  -lt 小于(less than)				 -le 小于等于(less equal)
#  -eq 等于(equal)					 -gt 大于(greater than)
#  -eg 大于等于(greater equal)			-ne 不等于(not equal)

# 2. 按照文件权限进行判断

#  -r 有读的权限(read)
#  -w 有写的权限(write)
#  -x 有执行的权限(execute)

# 3. 按照文件类型进行判断

# -f 文件存在并且是一个常规的文件(file)
# -e 文件存在(existence)
# -d 文件存在并是一个目录

# example

[ condition ] && echo OK || echo notok
```

### 流程控制

#### if判断

```shell
if [ 条件判断式 ];then
	程序
fi
# or
if [ 条件判断式 ]
then
	程序
fi

# 注意：
# [ 条件判断式 ] 中括号和条件判断式之间必须要有空格
# if 后要有空格
```

```shell
# example

if [ $1 -eq 1 ];then
        echo 'aaa'
fi

if [ $1 -eq 2 ]
then
        echo 'bbb'
fi
```

#### case语句

```shell
case $变量名 in
"值1")
	语句段1
;;
"值2")
	语句段2
;;
...
*)
	没有以上的值，执行此段
;;
esac

# 注意事项
# case 行位必须单词 "in"，每个匹配值以")"结束
```

#### for语句

```shell
# 语法1
for((初始值;循环条件;变量变化))
do
	程序
done

# example
# 1加到100
for((i=0;i<=100;i++))
do
	s=$[$s+$i] # s = $s + $i
done
echo $s
```

```shell
# 语法2
for 变量 in 值1 值2 值3...
do
	程序
done
```

#### while语句

```shell
while [ 条件判断式 ]
do
	程序
done
```

### demo-读取控制台的输入

语法：read(选项)(参数)
选项：
- -p：指定读取值时的提示符
- -t：指定读取值时等待的时间（秒）
参数：
​	变量：指定读取值的变量名

```shell
# example
#!/bin/bash

read -t 7 -p "Enter your name in 7 seconds " NAME
echo $NAME
```

### 函数

#### 系统函数

##### basename

basename [string/pathname] [suffix]
功能：basename命令会删除掉所有的前缀包括最后一个"/"字符，然后将字符串显示出来
如果指定了suffix，basename会将pathname或string中的最后的suffix也去掉

```shell
basename /home/aaa/zzz.txt
# zzz.txt
basename /home/aaa/zzz.txt .txt
# zzz
```

##### dirname

dirname 文件绝对路径
功能：从给定的包含绝对路径的文件名中去除文件名（非目录部分），然后返回剩下的路径（目录部分）

```shell
dirname /home/aaa/zzz.txt
# /home/aaa
```

#### 自定义函数

语法：

```shell
[ function ] funname[()]
{
	Aciton;
	[return int;]
}
funname

# 必须在函数调用前先定义函数，shell脚本是逐行执行的
# 函数返回值，只能通过$?系统变量获得，可显示加return返回，如果不加，将以最后一条命令运行结果，作为返回值。 n(0-255)

#example
function sum()
{
	s=0
	s=$[ $1 + $2 ]
	echo "$s"
}
read -p "input your paratermer1:" P1
read -p "input your paratermer2:" P2
sum $P1 $P2
```

### shell工具(important)

#### cut

`cut`命令从文件每一行剪切字节、字符和字段并将这些字节、字符和字段输出

语法：
cut [选项参数]  filename
说明：默认分隔符是制表符
选项参数：
- -f： 列号，提取第几列
- -d：分隔符，按照指定分隔符分割列

```shell
# example
# 数据准备
touch cut.txt
vim cut.txt
dong shen
guan zhen
wo wo
lai lai
le le

# 切割出第三列
cut -d " " -f 2,3 cut.txt
# 切割出guan
cat cut.txt | grep guan | cut -d " " -f 1
# 切割出$PATH变量第2个":"后的所有值
echo $PATH|cut -d ":" -f 3-
# 切割ifconfig后打印的IP地址
ifconfig ens33 | grep "inet" | cut -d " " -f 1 ... (省略)
```

#### sed

`sed`是一种流编辑器，以流的方式处理。
它一次处理一行内容。处理时，把当前的行存储在临时缓冲区中，称为“模式空间”，接着用sed命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕，接着处理下一行，以此重复，知道文件末尾。文件内容没有改变，除非使用重定向存储输出。

语法：
sed [选项参数] 'command' filename
选项参数：
- -e：直接在指令列模式上进行sed的动作编辑
命令功能描述：
- a：新增，a的后面可以接字符串，在下一行出现
- d：删除
- s：查找并替换

```shell
# example
# 数据准备
touch sed.txt
vim sed.txt
dong shen
guan zhen
wo wo
lai lai

le le

# 1. 将 mei nv 增加到sed.txt第二行下
sed "2a mei nv" sed.txt
# 输出打印，原文件不会改变
#!/bin/bash
dong shen
mei nv
guan zhen
wo wo
lai lai

le le

# 2. 删除sed.txt文件所有包含wo的行
sed "/wo/d" sed.txt
# 输出打印
#!/bin/bash
dong shen
guan zhen
lai lai

le le

# 3. 将sed.txt中的所有wo替换成ni
sed "s/wo/ni/g" sed.txt
# 输出打印
#!/bin/bash
dong shen
guan zhen
ni ni
lai lai

le le

# 4. 将sed.txt文件中的第二行删除并将wo替换为ni
sed -e '2d' -e 's/wo/ni/g' sed.txt
# 输出打印
#!/bin/bash
guan zhen
ni ni
lai lai

le le
```

#### awk

`awk`一个强大的文本分析工具，把文件逐行地读入，以空格为默认分隔符将每行切片，切开的部分再进行分析处理

基本语法：
- pattern：表示awk在数据中查找的内容，即匹配模式
- action: 在找到匹配内容时所执行的一系列命令
选项参数说明：
- -F：指定输入文件拆分隔符
- -v：赋值一个用户定义变量

```shell
# example
# 数据准备
cp /etc/passwd ./

# 1. 搜索passwd文件以root关键字开头的所有行，并输出该行的第7列
awk -F: '/^root/{print $7}' passwd
# 输出
/bin/bash

# 2. 搜索passwd文件以root关键字开头的所有行，并输出该行的第1列和第7列，中间以","号分割
awk -F: '/^root/{print $1","$7}' passwd
# 输出
root,/bin/bash
# 只有匹配了pattern的行才会执行action

# 3. 只显示/etc/passwd的第一列和第七列，以逗号分割，且在所有行前面添加列名user，shell在最后一行添加"hahaha,/bin/aaa"
awk -F: 'BEGIN{print "user, shell"}{print $1","$7} END{print "hahaha,/bin/aaa"}' passwd
# 输出
user, shell
root,/bin/bash
bin,/sbin/nologin
daemon,/sbin/nologin
adm,/sbin/nologin
lp,/sbin/nologin
sync,/bin/sync
shutdown,/sbin/shutdown
halt,/sbin/halt
mail,/sbin/nologin
operator,/sbin/nologin
games,/sbin/nologin
ftp,/sbin/nologin
nobody,/sbin/nologin
dbus,/sbin/nologin
systemd-coredump,/sbin/nologin
systemd-resolve,/sbin/nologin
tss,/sbin/nologin
polkitd,/sbin/nologin
libstoragemgmt,/sbin/nologin
unbound,/sbin/nologin
clevis,/sbin/nologin
setroubleshoot,/sbin/nologin
cockpit-ws,/sbin/nologin
cockpit-wsinstance,/sbin/nologin
sssd,/sbin/nologin
sshd,/sbin/nologin
chrony,/sbin/nologin
rngd,/sbin/nologin
tcpdump,/sbin/nologin
hahaha,/bin/aaa
# BEGIN在所有数据读取行之前执行，END在所有数据执行后执行

# 4. 将passwd文件中的用户id增加数值1并输出
awk -F: -v i=1 '{print $3+i}' passwd
```

##### awk内置的变量

- FILENAME 文件名
- NR 已读的记录数
- NF 浏览记录的域的个数（切割后，列的个数）

```shell
# 1. 统计passwd文件名，每行的行号，每行的列数
awk -F: '{print "filename:" FILENAME ", linenumber:" NR ", columns:" NF}' passwd
# 2. 切割IP
ifconfig eth0 | grep "inet addr" | awk -F: '{print $2}' | awk -F " " '{print $1}'
# 3. 查询sed.txt中空行所在的行号
awk '/^$/{print NR}' sed.txt
```

#### sort

语法：sort(选项)(参数)
选项说明：
- -n：依照取值的大小排序
- -r：以相反的顺序来排序
- -t：设置排序时所用的分割字符
- -k：指定需要排序的列

```shell
# 数据准备
# sort.sh
bb:40:5.4
bd:20:4.2
xz:50:2.3
cls:10:3.5
ss:30:1.6

# 按照“:”分割后的第三列倒序排序
sort -t : -nrk 2 sort.sh
# 打印输出
xz:50:2.3
bb:40:5.4
ss:30:1.6
bd:20:4.2
cls:10:3.5
```

## 面试题

```shell
# 1. 使用Linux命令查询file1中空行所在的行号
awk '/^$/{print NR}' sed.txt

# 2. 有文件chengji.txt 如下:
# 张三 40
# 李四 50
# 王五 60
# 使用Linux命令计算第二列的和并输出
cat chengji.txt | awk -F " " '{sum+=$2} END{print sum}'

# 3. shell脚本里面如何判断一个文件是否存在？如果不存在该如何处理
#!/bin/bash

if [ -f file.txt ]; then
	echo "文件存在！"
else
	echo "文件不存在！"
fi

# 4. 用shell写一个脚本，对文本中无序的一列数字排序  -最后累加
sort -n test.txt | awk '{a+=$0;print $0} END{print "SUM="a}'

# 5. 用shell脚本写出查找当前文件夹(/home)下所有的文本文件内容中包含有字符"shen"的文件名称
grep -r "shen" /home | cut -d ":" -f 1
```

