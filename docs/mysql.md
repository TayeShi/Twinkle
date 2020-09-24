# Mysql

## 相关内容

```shell
# 查看mysql安装目录
ps -ef|grep mysql
```

相关路径

|       路径       |                           | 备注 |
| :--------------: | :-----------------------: | :--: |
|  /var/lib/mysql  | mysql数据库文件的存放路径 |      |
| /usr/share/mysql |       配置文件目录        |      |
|     /usr/bin     |       相关命令目录        |      |
|                  |       启停相关脚本        |      |

### 查看字符集

```shell
SHOW VARIABLES LIKE 'CHARACTER%';
SHOW VARIABLES LIKE '%CHAR%';
```

### 更改字符集

```shell
vim /etc/my.cnf # cp /etc/my.cnf /etc/my.cnf.bk

# TODO
```

### 主要配置文件

- 二进制日志log-bin
- 错误日志log-error
- 查询日志log
- 数据文件
	- frm文件 存放表结构
	- frd文件 存放表数据
	- fri文件 存放表索引

## mysql的架构逻辑

连接层
服务层
引擎层
存储层

```mysql
show engines; # 查看数据库支持的引擎
show variables like '%storage_engine%'; # 查看数据库默认的引擎
```

MyISAM 和 InnoDB

|  对比项  |                          MyISAM                          |                            InnoDB                            |
| :------: | :------------------------------------------------------: | :----------------------------------------------------------: |
|  主外键  |                          不支持                          |                             支持                             |
|   事务   |                          不支持                          |                             支持                             |
|  行表锁  | 表锁，即使操作一条记录也会锁住整个表，不适合高并发的操作 |  行锁，操作时只锁某一行，不对其他行有影响，适合高并发的操作  |
|   缓存   |                只缓存索引，不缓存真实数据                | 不仅缓存索引还要缓存真实数据，对内存要求较高，而且内存大小对性能有决定性的影响 |
|  表空间  |                            小                            |                              大                              |
|  关注点  |                           性能                           |                             事务                             |
| 默认安装 |                            Y                             |                              Y                               |

## 索引优化分析

sql索引慢，执行时间长，等待时间长。
索引失效（单值索引，复合索引），关联join太多，服务器调优及参数配置。

### sql语句对于开发者的顺序

```mysql
SELECT DISTINCT
  <select_list>
FROM
  <left_table> <join_type>
JOIN <right_table> ON <join_condition>
WHERE 
  <where_condition>
GROUP BY
  <group_by_list>
HAVING
  <having_condition>
ORDER BY
  <order_by_condition>
LIMIT
  <limit_number>
```

### sql语句对于mysql的顺序

```mysql
1 FROM <left_table>
2 ON <join_condition>
3 <join_type> JOIN <right_table>
4 WHERE <where_condition>
5 GROUP BY <group_by_list>
6 HAVING <having_condition>
7 SELECT
8 DISTINCT <select_list>
9 ORDER BY <order_by_condition>
10 LIMIT <limit_number>
```

### 7种join

```mysql
SELECT <select_list> FROM tableA A LEFT JOIN tableB B ON A.Key = B.Key; # 主A副B，一条数据中肯定存在A，但不一定有B
SELECT <select_list> FROM tableA A RIGHT JOIN tableB B ON A.Key = B.Key; # 主B副A，一条数据中肯定存在B，但不一定有A
SELECT <select_list> FROM tableA A INNER JOIN tableB B ON A.Key = B.Key; # A和B的交集，一条数据在A中存在且在B中存在
SELECT <select_list> FROM tableA A LEFT JOIN tableB B ON A.Key = B.Key WHERE B.Key IS NULL; # 只有A，在B中不存在
SELECT <select_list> FROM tableA A RIGHT JOIN tableB B ON A.Key = B.Key WHERE B.Key IS NULL; # 只有B，在A中不存在
SELECT <select_list> FROM tableA A FULL OUTER JOIN tableB B ON A.Key = B.Key; # A和B的并集，包含所有的A，也包含所有的B
SELECT <select_list> FROM tableA A FULL OUTER JOIN tableB B ON A.Key = B.Key WHERE A.Key IS NULL OR B.Key IS NULL; # A和B的并集，排除A和B的交集，只在A中有数据或只在B中有数据
```

### 什么是索引

索引（Index）是帮助MySQL高效获取数据的数据结构
索引是数据结构
提高查找效率，类比字典
索引是 排好序的快速查找数据结构
索引会影响 **查找** 和 **排序**
索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式存储在磁盘上
索引非指明，都是B树

优势： 提高数据检索的效率，降低数据库的IO成本。降低数据排序的成本，降低CPI的消耗。
劣势：会降低表更新的速度，如 INSERT，UPDATE和DELETE。更新同时更新索引

### 适合和不适合建索引的情况

适合：
1. 主键自动建立唯一索引
2. 频繁作为查询条件的字段应该创建索引
3. 查询中与其他表关联的字段，外键关系建立索引
4. 频繁更新的字段不适合创建索引
5. Where条件里用不到的字段不创建索引
6. 单键/组合索引的选择？（高并发下倾向创建组合索引）
7. 查询中排序的字段，排序字段若用过索引去访问将大大提高排序速度
8. 查询中统计或者分组字段

不适合：
1. 表记录太少
2. 经常增删改的表
3. 数据重复且分布平均的表字段，建索引意义不大

## 查询截取分析

### Explain

```mysql
explain (select sql);

# 查询结果：
# id
# select_type
# table
# type
# possible_keys
# key
# key_len
# ref
# rows
# Extra
```

#### **id**:
- id相同，执行顺序是由上至下
- id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行
- id相同不同，同时存在

#### **select_type和table(数据读取操作的操作类型)**:
- SIMPLE 简单的select查询，不包含子查询或union
- PRIMARY 查询中若包含任何复杂的子部分，最外层则为primary
- SUBQUERY 在select或where中的子查询
- DERIVED 在FROM列表中包含的子查询被标记为derived，mysql递归这些子查询，放在临时表中
- UNION 若第二个select出现在union之后，则被标记为union；若union包含在from子句的子查询中，外层select将被标记为derived
- UNION RESULT 从UNION表获取结果的select

#### **type**
- **system**：表只有一行记录（等于系统表），这是const的特例，平时不会出现
- **const**：表示通过索引一次就找到了，const用于比较 primary key 或者 unique索引。因为只匹配一行数据，所以很快。如将主键置于where列表中，MySQL就能将该查询转换为一个常量
- **eq_ref**：唯一性索引扫描，对于每个索引建，表中只有一条记录与之匹配。常见于主键或者唯一索引扫描
- **ref**：非唯一性索引扫描，返回匹配某个单独值的所有行。本质上也是一种索引访问，它返回所有匹配某个单独值的行，然而，它可能会找到多个复合条件的行，所以它应该属于查找和扫描的混合体
- **range**：只检索给定范围的行，使用一个索引来选择行。key列显示使用了哪个索引。一般就是在你的where语句中出现了 between、<、>、in 等的查询。这种范围扫描索引扫描比全表扫描好，因为它只需要开始于索引的某一点，而结束于另一点，不用扫描全部索引。
- **index**：Full Index Scan，index与ALL区别为index类型只遍历索引树。这通常比ALL快，因为索引文件通常比数据文件小。（也就是说虽然all和index都是全表，index从索引中，all从磁盘中）
- **all**：Full table Scan，将遍历全表以找到匹配的行。

一般来说，得保证查询至少达到range级别，最好能达到ref

#### **possible_keys & key**

`possible_keys` 显示可能应用在这张表中的索引，一个或多个。
`key` 实际使用的索引。如果为NULL，则没有使用索引。**查询中若使用了覆盖索引，则该索引金出现在key列表中**

覆盖索引： 查询的字段和建的索引的个数和顺序刚好一致

#### **key_len**

`key_len` 表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度。在不损失精确性的情况下，长度越短越好。
key_len 显示的值为索引字段的最大可能长度，**并非实际使用长度**，即 key_len 是根据表定义计算而得，不是用过表内检索出的

#### **ref**

`ref` 显示索引的哪一列被使用了，如果可能的话，是一个常数。哪些列或常量被用于查找索引列上的值

#### **rows**

`rows` 根据表统计信息及索引选用情况，大致估算出找到所需的记录所需要读取的行数

#### **Extra**
包含不适合在其他列显示，但十分重要的额外信息

`Using filesort` 说明mysql会对数据使用一个外部的索引排序，而不是按照表内的索引顺序进行读取。MySQL中无法利用索引完成的排序操作成为“文件排序”
deal: order by 索引

`Using temporary` 使用了临时表保存中间结果，MySQL在对查询结果排序时使用临时表。常见于排序 order by 和分组查询 group by
deal: group by 按索引的个数和顺序来

`USING index` 表示相应的操作使用了覆盖索引(Covering Index)，避免访问了表的数据行，效率不错！如果同时出现using where，表明索引被用来执行索引键值的查找；如果没有同时出现using where，表明索引来读取数据而非执行查找动作。

`Using where` 使用了where过滤

`using join buffer` 使用了连接缓存

`impossible where` where子句的值总是false，不能用来获取任何元组

`select tables optimized away` 在没有group by子句的情况下，基于索引优化MIN/MAX操作或者对于MyISAM存储引擎优化count(*)操作，不必等到执行阶段再进行计算，查询执行计划生成的阶段即完成优化

`distinct` 优化distinct操作，在找到第一行匹配的元组后即停止找同样值的动作

### 索引失效问题

#### 索引失效的原因

```mysql
# 案例表
CREATE TABLE staffs(
	id INT PRIMARY KEY AUTO_INCREMENT,
	NAME VARCHAR(24) NOT NULL DEFAULT '' COMMENT '姓名',
	age INT NOT NULL DEFAULT 0 COMMENT '年龄',
	pos VARCHAR(20) NOT NULL DEFAULT '' COMMENT '职位',
	add_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间'
)CHARSET utf8 COMMENT '员工记录表';

INSERT INTO staffs(NAME, age, pos, add_time) VALUES ('z3',22,'manager',NOW());
INSERT INTO staffs(NAME, age, pos, add_time) VALUES ('July',23,'dev',NOW());
INSERT INTO staffs(NAME, age, pos, add_time) VALUES ('2000',23,'dev',NOW());
SELECT * FROM staffs;

ALTER TABLE staffs ADD INDEX idx_staffs_nameAgePos(name, age, pos);
```

```
1.全值匹配我最爱
2.最佳左前缀法则
3.不在索引列上做任何操作（计算、函数、（自动or手动）类型转换），会导致索引失效而转向全表扫描
4.存储引擎不能使用索引中范围条件右边的列
5.尽量使用覆盖索引（只访问索引的查询（索引列和查询列一致）），减少select *
6.mysql在使用不等于(!=或者<>)的时候无法使用索引会导致全表扫描
7.is null, is not null 也无法使用索引
8.like以通配符开头('%abc...')mysql索引失效会变成全表扫描的操作
9.字符串不加单引号索引失效
10.少用or，用它来连接时会索引失效
```

索引情况

![image-20200924233730815](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924233730815.png)

#### 1. 全值匹配我最爱

按索引顺序查询最好
使用的索引对应的字段越多，key_len 的长度也会越长

![image-20200924233846407](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924233846407.png)

![image-20200924233956820](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924233956820.png)

![image-20200924234037397](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924234037397.png)

#### 2. 最佳左前缀法则

如果不按所建的索引顺序查询，则不会使用索引

![image-20200924234226536](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924234226536.png)

如果使用了索引 name age pos 中的 name 和 pos，则会按最佳左前缀法则只name部分使用索引，pos部分索引失效

![image-20200924234510227](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924234510227.png)

#### 3. 不在索引列上做任何操作(计算、函数、(自动 or 手动)类型转换)，会导致索引失效而转向全表扫描

尽量不要在索引列上做计算，如下如，在 name 索引列上做了计算后，导致查询索引失效

![image-20200924235252922](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200924235252922.png)

#### 4. 存储引擎不能使用索引中范围条件右边的列

当索引三个值中第二个用范围查找的时候，也使用了索引，但只使用了name和age,age之后的索引pos失效

![image-20200925000056882](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925000056882.png)

#### 5. 尽量使用覆盖索引（只访问索引的查询（索引列和查询列一致）），减少select *

使用 select *

![image-20200925000604041](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925000604041.png)

select 后面查询的字段仅包含索引字段(全部或部分)，都多了一个using index，比select * 更好

![image-20200925000805586](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925000805586.png)

当查询字段为索引字段，where条件为索引字段，但用了 > 。
mysql8.0

![image-20200925001310945](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925001310945.png)

#### 6. mysql在使用不等于(!=或者<>)的时候无法使用索引会导致全表扫描

![image-20200925002005302](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925002005302.png)

#### 7. is null, is not null 也无法使用索引

![image-20200925002232411](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925002232411.png)

![image-20200925002306737](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925002306737.png)

#### 8. like以通配符开头('%abc...')mysql索引失效会变成全表扫描的操作

当%在左边开头的时候是全表扫描

![image-20200925002851336](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925002851336.png)

当%在右边的时候

![image-20200925003001506](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925003001506.png)

> 解决%%导致索引失效的问题，避免全表扫描，使用覆盖索引查询

![image-20200925003316383](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925003316383.png)

#### 9.字符串不加单引号索引失效

![image-20200925004758505](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925004758505.png)

![image-20200925004854280](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925004854280.png)

#### 10.少用or，用它来连接时会索引失效

![image-20200925005004407](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925005004407.png)

#### 小总结

![image-20200925005211267](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200925005211267.png)

#### 索引面试题分析

```mysql
create table test03(
	c1 char(10),
  c2 char(10),
  c3 char(10),
  c4 char(10),
  c5 char(10)
);

insert into test03(c1, c2, c3, c4, c5) values ('a1','a2','a3','a4','a5');
insert into test03(c1, c2, c3, c4, c5) values ('b1','b2','b3','b4','b5');
insert into test03(c1, c2, c3, c4, c5) values ('c1','c2','c3','c4','c5');
insert into test03(c1, c2, c3, c4, c5) values ('d1','d2','d3','d4','d5');
insert into test03(c1, c2, c3, c4, c5) values ('e1','e2','e3','e4','e5');

select * from test03;
```





主从复制

mysql锁机制