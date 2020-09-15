# multiple-package-build

## 功能介绍

1. 对多包工程进行编译，将 `file` 依赖工程复制到 `dist` 目录后转换为正常依赖

## 安装

``` 
yarn add multiple-package-build 
//or 
npm install multiple-package-build 
```

## 使用   

```ts 
import multiplePackageBuild from 'multiple-package-build'

multiplePackageBuild({cwd?:'/xxxx'})

``` 

## cli模式

```

npm i -g multiple-package-build

multiple-package-build start
```
 
