## 电商平台数据可视化

### 运行方式：首先使用node app.js命令启动koa-server分支中的后台服务端，然后使用npm run serve（客户端）/http-server -p 8889（云服务器）启动http服务，访问8889端口即可

### 注意：clone后需要npm i安装依赖，并且启动服务端服务才可以呈现效果

### 功能简介

使用vue-cli+Echarts对数据进行展示，并包含切换全屏和小屏、切换主题功能

### 程序结构

主要包含前、后端

#### koa-server

主要负责服务端代码，使用axios响应前端请求。

#### vision

主要包含各个页图表的组件

主要包含以下文件：

* components文件夹：
  * rank.js ：销量排行表
  * map.js ：商家分布表
  * seller.js：销量表
  * trend.js：销量趋势表
  * hot.js ：销量成分占比表
  * stock.js ：销量与存储表

#### 其他

主要包含以下文件：

* assets文件夹：资源文件
