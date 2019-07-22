# youxiangju-admin-fe

## 发布

```bash
export DEV_ADMIN_FE_PORT=8001
export DEV_ADMIN_FE_API_HOST=http://localhost:9001
export DEV_REGISTER_URL=http://192.168.1.143:18002/shareRegister.html
bash start.sh dev
```

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Run your unit tests

```
yarn run test:unit
```

## rules

### 项目结构

```shell
├── App.vue
├── assets #资源文件
│   ├── login-bg.jpg
├── components #组件
│   ├── Header.vue
│   ├── Sidebar.vue
│   ├── Tags.vue
│   └── YxjMenu.vue
├── config.js #根据环境而变化的配置
├── main.js
├── navigator.js #导航
├── router.js #路由
├── core #一些全局的逻辑
├── store #全局数据
│   ├── Menu.js
│   ├── Tag.js
│   ├── actionKeys.js
|   ├── Api.js #URL接口统一管理 
│   ├── requestFacade.js #数据请求方法（get ,post, postWithFile ,postJOSN）  
│   ├── index.js #vuex状态管理
│   ├── mutationKeys.js
│   └── stateKeys.js
└── views #页面，有子模块的模块，要写成文件夹
    ├── Home.vue
    ├── login.vue
    └── permission
        ├── roleManagement.vue
        └── userManagement.vue
```

## mixin 的用法

### 分页

> 引入 mixin

```js
import { mixins } from '@/core'

mixins: [
    mixins.pageMixin
],
```

> 定义这三个方法

```js
getUrl () {
    return 'posBatch/queryPosBatch'
},
getPageParams () {
    return {
        brandId: this.searchData.model,
        devNo: this.searchData.devNo,
        batchNO: this.searchData.batchNO
    }
},
// 处理数据
handleRows (rows) {
    // rows 是一个数组
    this.inventoryData = rows
}
```

> 在 mounted 的时候加载数据

```js
mounted () {
    this.loadData()
}
```
