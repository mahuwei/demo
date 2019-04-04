# Angular Pwa Demo [文档](https://angular.cn/guide/service-worker-getting-started)

## 构建项目：

`ng build --prod`

## 测试时使用 http-server

`http-server -p 8080 -c-1 dist/demo`

## 过程，[代码参见](src\app\check-for-update.service.ts)

### 调用 `SwUpdate.checkForUpdate()`

如果没有获取到需要更新的版本信息，后续的事件不会触发

### 触发回调事件：available

1. 回调携带参数：UpdateAvailableEvent，分为两部分：
   - current:当前版本信息
   - available:可获取的版本信息
   - 判断版本是否更新通过：current.hash !== available.hash 来判断
   - current 和 available 的 appData 来自[ngsw-config.json](src\ngsw-config.json)中的"appData"设置
2. 判断有新版本，调用:`SwUpdate.activateUpdate(): Promise<void>`获取新版本
   - 更新成功后会先触发`SwUpdate.activated()`
   - 然后在返回 SwUpdate.activateUpdate()的回调结果
   - 可以在上述两个位置进行判断可以重新加载了

### 重新加载

`document.location.reload();`

## 定时自动检查是否新的更新

详细查看[文档](https://angular.cn/guide/service-worker-communications)
为了避免影响页面的首次渲染，在注册 ServiceWorker 脚本之前，ServiceWorkerModule 默认会等待应用程序达到稳定态。如果不断轮询更新（比如调用 interval()）将阻止应用程序达到稳定态，也就永远不会往浏览器中注册 ServiceWorker 脚本。
在开始轮询更新之前，你可以先等待应用程序达到稳定态，以避免这种情况（如上例所示）。
请注意，应用中所执行的各种轮询都会阻止它达到稳定态。欲知详情，参见 isStable 文档。

## 在[ngsw-config.json](src\ngsw-config.json)中的"appData"设置更新内容

添加版本号、更新日期、是否需要强制更新、更新说明
