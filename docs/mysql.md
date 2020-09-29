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

CREATE INDEX idx_test03_c1234 on test03(c1, c2, c3, c4);

EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1';
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2';
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c3 = 'a3';
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c3 = 'a3' AND c4 = 'a4';

EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c3 = 'a3' AND c4 = 'a4'; # 使用了4个索引字段
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c4 = 'a4' AND c3 = 'a3'; # 使用了4个索引字段
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c3 > 'a3' AND c4 = 'a4'; # 使用了3个索引字段，c4没生效
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c4 > 'a4' AND c3 = 'a3'; # 使用了4个索引字段
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c4 = 'a4' ORDER BY c3;   # 使用了2个索引字段，c3用于排序
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' ORDER BY c3;                 # 同上
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' ORDER BY c4;   							# 使用了2个索引字段，c4没用于排序，出现filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c5 = 'a5' ORDER BY c2, c3;  						# 使用c1一个索引字段，c2、c3用于排序，没出现filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c5 = 'a5' ORDER BY c3, c2; 						# 使用c1一个索引字段，c3、c2没用于排序，出现filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' ORDER BY c2, c3;							# 使用2个索引字段，c2、c3用于排序，filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c5 = 'a5' ORDER BY c2, c3; # 使用2个索引字段，c2、c3用于排序，filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c2 = 'a2' AND c5 = 'a5' ORDER BY c3, c2; # 使用2个索引字段，c2、c3用于排序，无filesort，先在where中使用了索引字段c2(已经变为const)，所以后面 ORDER BY 的时候不会再出现filesort

EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c5 = 'a5' GROUP BY c3, c2; # 使用索引字段c1，using filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c4 = 'a4' GROUP BY c2, c3; # 使用索引字段c1，没使用filesort
EXPLAIN SELECT * FROM test03 WHERE c1 = 'a1' AND c4 = 'a4' GROUP BY c3, c2; # 使用索引字段c1 ， using temporary，using filesort
```

定值、范围、排序。一般order by是给个范围。group by 都要创建临时表

> 对于单键索引，尽量选择针对当前query过滤性更好的索引
> 在选择组合索引的时候，当前query中过滤性最好的字段在索引字段顺序中，位置越靠前越好。
> 在选择组合索引的时候，尽量选择可以能够包含当前query中的where子句中更多字段的索引。
> 尽可能通过分析统计信息和调整query的写法来达到选择合适索引的目的

![image-20200926232655277](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200926232655277.png)

![image-20200926232723790](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200926232723790.png)

### 分析sql

1. 观察，至少跑1天，看看生产的慢sql的情况
2. 开启慢查询日志，设置阈值，比如超过5秒钟的就是慢sql，并将它抓取出来
3. Explain + 慢sql分析
4. show profile
5. 运维经理 or DBA，进行sql数据库服务器的参数调优

#### 总结

1. 慢查询的开启并捕获

2. explain + 慢sql分析

3. show profile 查询sql在mysql服务器里面的执行细节和生命周期情况

4. sql数据库服务器的参数调优

## 查询截取分析

### 查询优化

#### 永远小表驱动大表

类似嵌套循环Nested Loop
优化原则：小表驱动大表，即小的数据集驱动大的数据集。

```sql
########## 原理 ##########

select * from A where id in (select id from B)
# 等价于：
# for select id from B
# for select * from A where A.id = B.id
########## 当B表的数据集必须小于A表的数据集时，用in由于exist

select * from A where exists (select 1 from B where B.id = A.id)
# 等价于：
# for select * from A
# for select * from B where B.id = A.id
########## 当A表的数据集小于B表的数据集时，用exists由于in

## 注意： A表于B表的ID字段应建立索引
```

** exists **
SELECT ... FROM table WHERE EXISTS (subquery)
该语法可以理解为：将主查询的数据，放到子查询中做条件验证，根据验证结果（TRUE或FALSE）来决定主查询的数据结果是否得以保留
** 提示 **
1. EXISTS(subquery)只返回TRUE或FALSE，因此子查询中的SELECT * 也可以是SELECT 1 或 SELECT 'X'，官方说法是实际执行时会忽略SELECT清单，因此没有区别
2. EXISTS子查询的实际执行过程可能经过了优化而不是我们理解上的逐条对比，如果担忧效率问题，可进行实际检验以确定是否有效率问题
3. EXISTS 子查询往往也可以用条件表达式、其他子查询或者JOIN来代替，何种最优需要具体问题具体分析

#### order by 关键字优化

##### order by 子句，尽量使用Index方式排序，避免使用 filesort 方式排序

![image-20200927001517268](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200927001517268.png)

mysql 支持两种方式的排序：filesort 和 index。
index效率高，它指mysql扫描索引本身完成排序。
filesort效率低，全表扫描。

order by 满足两种情况，会使用index方式排序：
1. order by 语句使用索引最左前列
2. 使用 where 子句与 order by 子句条件列组合满足索引最左前列

##### 尽可能在索引列上完成排序操作，遵照索引建的最佳左前缀

##### 如果不在索引列上，filesort 有两种算法：mysql就要启动双路排序和单路排序

** 双路排序 **

mysql 4.1 之前是使用双路排序，字面意思就是两次扫描磁盘，最终得到数据，读取行指针和orderby列，对他们进行排序，然后扫描已经排序号的列表，按照列表中的值重新从列表中读取对应的数据输出。
从磁盘取排序字段，在buffer进行排序，再从磁盘取其他字段。

** 取一批数据，要对磁盘进行了两次扫描，总所周知，I\O是很耗时的，所以在mysql4.1之后，出现了第二中改进的算法，就是单路排序 **

** 单路排序 **

从磁盘读取查询需要的所有列，按照order by列在buffer对他们进行排序，然后扫描排序后的列表进行输出，它的效率更快一些，避免了第二次读取数据。并且把随机IO变成了顺序IO，但是它会使用更多的空间，因为它把每一行都保存在内存中了。

** 结论及引申出的问题 **

由于单路是后出的，总体而言好于单路

使用单路存在的问题：
在sort_buffer中，方法B比方法A要多占用很多空间，因为方法B是把所有字段都取出，所以有可能取出的数据的总大小超出了sort_buffer的容量，导致每次只能取sort_buffer容量大小的数据，进行排序（创建tmp文件，多路合并），排完再取sort_buffer容量大小，再排...从而多次I\O
本来想省一次I\O操作，反而导致了大量的I\O操作，反而得不偿失。

##### 优化策略

- 增大 sort_buffer_size 参数的设置
- 增大 max_length_for_sort_data 参数的设置
- Why：（提高order by的速度）
	1. `order by` 时， `select *`是一个大忌，只query需要的字段，这点非常重要。这里的影响是：
	   1. 当query的字段大小总和小于`max_length_for_sort_data`而且排序字段不是`TEXT|BLOB`类型时，会用改进后的算法--单路排序，否则用老算法--多路排序。
	   2. 两种算法的数据都有可能超出`sort_buffer`的容量，超出之后，会创建tmp文件进行合并排序，导致多次I|O，但是用单路排序算法的风险会更大一些，所以要提高`sort_buffer_size`。
	2. 尝试提高`sort_buffer_size`，不管用哪种算法，提高这个参数都会提高效率。当然，要根据系统的能力去提高，因为这个参数是针对每个进程的。
	3. 尝试提高`max_length_for_sort_data`，提高这个参数，会增加用改进算法的概率。但是如果设的太高，数据总容量超出`sort_buffer_size`的概率就会增大，明显症状是高的磁盘I/O活动和低的处理器使用率。

##### 小总结

![image-20200927010320514](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200927010320514.png)

#### group by 关键字优化

group by 实质是先排序后进行分组，遵照索引建的最佳左前缀。
当无法使用索引列，增大`max_length_for_sort_data`参数的设置 + 增大`sort_buffer_size`参数的设置。
where 高于 having，能写在where限定的条件就不要去having限定了。

### 慢查询日志

#### 是什么

- mysql的慢查询日志是mysql提供的一种日志记录，它用来记录在mysql中相应时间超过阀值的语句，具体指运行时间超过`long_query_time`值的sql，则会被记录到慢查询日志中。
- 具体指运行时间超过`long_query_time`值的sql，则会被记录到慢查询日志中。`long_query_time`的默认值为10，意思是运行10秒以上的语句。
- 有他来查看哪些sql超出了我们的最大忍耐时间值，比如一条sql执行超过5秒钟，我们就算慢sql，希望能收集超过5秒的sql，结合之前explain进行全面分析。

#### 怎么玩

##### 说明

默认情况下，mysql数据库没有开启慢查询日志，需要我们手动来设置这个参数。

当然，如果不是调优需要的话，一般不建议启动该参数，因为开启慢查询日志会或多或少带来一定的性能影响。慢查询日志支持将日志记录写入文件。

##### 查看是否开启及如何开启

默认 `SHOW VARIABLES LIKE '%slow_query_log%'`

![image-20200927012236994](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200927012236994.png)

开启 `set global show_query_log=1`
使用 `set global show_query_log=1`开启了慢查询日志只对当前数据库生效，如果mysql重启后则会失效。![image-20200927012441661](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200927012441661.png)

##### 开启了慢查询日志后，什么样的sql才会记录到慢查询日志里面

![image-20200927012550093](/Users/taye/Library/Application Support/typora-user-images/image-20200927012550093.png)

##### case:
- 查看当前多少秒算慢： `SHOW VARIABLES LIKE 'long_query_time%'`；
- 设置慢的阀值时间：`set global long_query_time=3`;
- 为什么设置后看不出变化：需要重新连接或开一个会话才能看到修改值。 `SHOW VARIABLES LIKE 'long_query_time%'`；  `SHOW GLOBAL VARIABLES LIKE 'long_query_time'`；
- 记录慢sql并后续分析 日志中查看
- 查询当前系统中有多少条慢查询记录 `show global status like 'Slow_queries'`;

##### 配置版

```config
[mysqld]
slow_query_log=1;
slow_query_log_file=/var/lib/mysql/xxxx.log;
long_query_time=3;
log_output=FILE;
```

#### 日志分析工具mysqldumpslow

##### mysqldumpslow的帮助信息

```shell
mysqldumpslow -h;

s: 表示按照何种方式排序
c: 访问次数
l: 锁定时间
r: 返回记录
t: 查询时间
al: 平均锁时间
ar: 平均返回记录数
at: 平均查询时间
t: 即为返回前面多少条的数据
g: 后边搭配一个正则匹配模式，大小写不敏感的
```

##### 工作常用参考

```
得到返回记录集最多的10个sql
mysqldumpslow -s r -t 10 /var/lib/mysql/xxx.log

得到访问次数最多的10个sql
mysqldumpslow -s c -t 10 /var/lib/mysql/xxx.log

得到按照时间排序的前10条里面含有左连接的查询语句
mysqldumpslow -s t -t 10 -g "left join" /var/lib/mysql/xxx.log

另外建议在使用这些命令式结合 | 和 more 使用，否则有可能出现爆屏情况
mysqldumpslow -s r -t 10 /var/lib/mysql/xxx.log | more
```

### 批量数据脚本

往表里插入1000W数据

#### 建表

```sql
# 新建库
CREATE DATABASE bidData;
use bigData;

# 建表dept
CREATE TABLE dept(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	deptno MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
	dname VARCHAR(20) NOT NULL DEFAULT "",
	loc VARCHAR(13) NOT NULL DEFAULT "",
) ENGINE=INNODB DEFAULT CHARSET=GBK;

# 建表emp
CREATE TABLE emp(
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	empno MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
	ename VARCHAR(20) NOT NULL DEFAULT "",
	job VARCHAR(9) NOT NULL DEFAULT "",
	mgr MEDIUMINT UNSIGNED NOT NULL DEFAULT 0, /* 上级编号 */
	hiredate DATA NOT NULL,/*入职时间*/
	sal DECIMAL(7,2) NOT NULL,/*薪水*/
	comm DECIMAL(7,2) NOT NULL,/*红利*/
	deptno MEDIUMINT UNSIGNED NOT NULL DEFAULT 0 /*部门编号*/
) ENGINE=INNODB DEFAULT CHARSET=GBK
```

#### 设置参数`log_bin_trust_function_creators`

![image-20200927020219740](https://taye-1255887752.cos.ap-chengdu.myqcloud.com/markdown/image-20200927020219740.png)

#### 创建函数，保证每条数据都不同

随机产生字符串

```sql
# 用于随机产生字符串
DELIMITER $$
CREATE FUNCTION rand_string(n INT) RETURNS VARCHAR(255)
BEGIN
	DECLARE char_str VARCHAR(100) DEFAULT 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	DECLARE return_str VARCHAR(255) DEFAULT '';
	DECLARE i INT DEFAULT 0;
	WHILE i < n DO
	SET return_str=CONCAT(return_str,SUBSTRING(chars_str,FLOOR(1+RAND()*52),1));
	SET i=i+1;
	END WHILE;
	RETURN return_str;
END $$

# 假如要删除
# drop function rand_str;
```

随机产生部门编号

```sql
# 用于随机产生部门号
DELIMITER $$
CREATE FUNCTION rand_num() RETURNS VARCHAR(5)
BEGIN
	DECLARE i INT DEFAULT 0;
	SET i = FLOOR(100+RAND()*10);
	RETURN i;
END $$

# 假如要删除
# drop function rand_num;
```

#### 创建存储过程

创建往emp表中插入数据的存储过程

```sql
DELIMITER $$
CREATE PROCEDURE insert_emp(IN START INT(10), IN max_num INT(10)
BEGIN
	DECLARE i INT DEFAULT 0;
  SET autocommit=0;
	REPEAT
	SET i = i+1;
	INSERT INTO emp(empno, ename, ejob, mgr, hiredate, sal, comm, deptno) VALUE ((START+i), rand_string(6), 'SALESMAN', 0001, CURDATE(), 2000, 400, rand_num());
	UNTIL i = max_num
	END REPEAT;
	COMMIT;
END $$
```

创建往dept表中插入数据的存储过程

```sql
DELIMITER $$
CREATE PROCEDURE insert_dept(IN START INT(10), IN max_num INT(10)
BEGIN
	DECLARE i INT DEFAULT 0;
  SET autocommit=0;   
	REPEAT
	SET i = i+1;
	INSERT INTO dept(deptno, dname, loc) VALUE ((START+i), rand_string(10), rand_string(8));
	UNTIL i = max_num
	END REPEAT;
	COMMIT;
END $$
```



#### 调用存储过程

dept

```sql
DELIMITER;
CALL insert_dept(100, 10);
```

emp

```sql
DELIMITER;
CALL insert_emp(100, 10);
```

### Show Profile

**是什么**：是mysql提供可以用来分析当前会话中语句执行的资源消耗情况。可以用于sql的调优和测量
默认情况下，参数处于关闭状态，并保存最近15次的运行结果

```
1.是否支持，看看当前的mysql版本是否支持
Show variables like 'profiling';

2.开启功能，默认是关闭，使用前需要开启
set profiling=on;

3.运行sql
select * from emp group by id%10 limit 150000;
select * from emp group by id%20 order by 5;

4.查看结果，show profiles;

5.诊断sql，show profile cpu, block io for query 上一步前面的问题sql数字号码；
参数备注

6.日常开发需要注意的结论

```

## mysql锁机制

锁：读锁、写锁，表锁、行锁

三锁： 行锁、表锁、页锁

```mysql
# 数据准备
CREATE TABLE `lock1`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
);

CREATE TABLE `lock2`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
);

INSERT INTO lock1 (id, name) VALUES (1, 'a');
INSERT INTO lock1 (id, name) VALUES (2, 'b');
INSERT INTO lock1 (id, name) VALUES (3, 'c');
INSERT INTO lock1 (id, name) VALUES (4, 'd');

INSERT INTO lock2 (id, name) VALUES (1, 'a');
INSERT INTO lock2 (id, name) VALUES (2, 'b');
INSERT INTO lock2 (id, name) VALUES (3, 'c');
INSERT INTO lock2 (id, name) VALUES (4, 'd');

show open tables; # 查看锁表
```

```mysql
# 读锁例子
# session1
LOCK TABLE lock1 read; 	# session1, 执行加锁lock1表
SHOW OPEN TABLES; 			# 查看锁表情况，lock1表被锁
SELECT * FROM lock1;		# session1, 查看lock1表记录,可以查看
# session2
SELECT * FROM lock1;		# session2, 查看lock1表记录，可以查看
# session1
SELECT * FROM lock2;		# session1, 查看lock2表记录，不可以查看
# session2
SELECT * FROM lock2;		# session2, 查看lock2表记录，可以查看
# sessson1
UPDATE lock1 set name = 'a1' WHERE id = 1; # session1, 不可以更改lock1表记录
# session2
UPDATE lock1 set name = 'a1' WHERE id = 1; # session2，更改记录被阻塞
# session1
UNLOCK tables; # session1, 执行解锁, session2执行更改操作

# 思考
# 当session1对lock1加读锁，session2是否能对lock1加读锁？
# 操作结果，session1对lock1加读锁后，session2可以继续对lock1加读锁。当session1解开对lock1的读锁后，更改其中某条数据，该操作被阻塞。session2解开对lock1的读锁后，session1的更改操作执行。



```


主从复制



