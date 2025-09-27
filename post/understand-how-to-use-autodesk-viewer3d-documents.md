---
title: '理解Autodesk Viewer3D文档的使用方法'
description: '理解Autodesk Viewer3D文档的使用方法 _Exported on 2025/7/1 at GMT+8 16:49:48 from Cursor (1.1.6)_ --- User @https://aps.autodesk.com/en/docs/viewer/v7/reference...'
author: 'jue'
date: 2025-07-01
lastUpdated: 2025-09-02
category: 'Tech Talk'
issue_number: 2
---

# 理解 Autodesk Viewer3D 文档的使用方法

_Exported on 2025/7/1 at GMT+8 16:49:48 from Cursor (1.1.6)_

---

**User**

@https://aps.autodesk.com/en/docs/viewer/v7/reference/Viewing/Viewer3D 仔细阅读这个文档，这里的参数，属性 方法具体如何使用。

---

**Cursor**

我来帮您理解 Autodesk Viewer3D 文档中的参数、属性和方法的使用方法。

我会帮你详细解析 Autodesk Viewer3D API 的关键参数、属性和方法的使用方法。

根据收集到的信息，我将为您详细解析 Autodesk Viewer3D API 的参数、属性和方法的使用方法。

# Autodesk Viewer3D API 详解

## 一、初始化与配置

### 1. 基本初始化流程

Viewer3D 的初始化主要分为两步：

```javascript
// 1. 初始化Viewer环境
Autodesk.Viewing.Initializer(options, function () {
  // 2. 创建Viewer实例
  var viewer = new Autodesk.Viewing.Viewer3D(htmlElement, config)
  viewer.start() // 启动Viewer
  // 加载模型
})
```

### 2. 初始化参数

```javascript
// Initializer参数
var options = {
  env: 'AutodeskProduction', // 环境：'AutodeskProduction'或'Local'(离线模式)
  getAccessToken: function (callback) {
    // 获取访问令牌的函数
    callback('访问令牌', 3600) // 令牌和过期时间(秒)
  },
  useADP: false // 是否使用ADP
}

// Viewer3D构造函数参数
var config = {
  extensions: ['Autodesk.DocumentBrowser'], // 要加载的扩展
  theme: 'light-theme' // 主题：'light-theme'或'dark-theme'
}
```

### 3. 离线模式配置

```javascript
// 离线模式配置
var options = {
  env: 'Local', // 使用本地环境
  document: './model/0.svf' // 本地SVF文件路径
}
```

## 二、模型加载

### 1. 在线模型加载

```javascript
// 通过URN加载模型
Autodesk.Viewing.Document.load(
  'urn:' + modelUrn,
  // 成功回调
  function (doc) {
    var viewables = doc.getRoot().getDefaultGeometry()
    viewer.loadDocumentNode(doc, viewables)
  },
  // 失败回调
  function (errorCode, errorMsg) {
    console.error('模型加载失败:', errorCode, errorMsg)
  }
)
```

### 2. 离线模型加载

```javascript
// 直接加载本地SVF文件
viewer.loadModel(
  './model/0.svf',
  {},
  // 成功回调
  function (model) {
    console.log('模型加载成功')
  },
  // 失败回调
  function (errorCode) {
    console.error('模型加载失败:', errorCode)
  }
)
```

## 三、事件处理

### 1. 事件监听

```javascript
// 添加事件监听
viewer.addEventListener(
  Autodesk.Viewing.SELECTION_CHANGED_EVENT,
  onSelectionChanged
)
viewer.addEventListener(
  Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
  onGeometryLoaded
)

// 事件处理函数
function onSelectionChanged(event) {
  // event.dbIdArray 包含选中构件的ID数组
  console.log('选中的构件ID:', event.dbIdArray)

  if (event.dbIdArray.length === 1) {
    // 获取选中构件的属性
    viewer.getProperties(event.dbIdArray[0], function (data) {
      console.log('构件属性:', data)
    })
  }
}

function onGeometryLoaded() {
  console.log('几何体加载完成')
  // 模型加载完成后的操作
}
```

### 2. 常用事件类型

```javascript
// 常用事件类型
Autodesk.Viewing.SELECTION_CHANGED_EVENT // 选择变更事件
Autodesk.Viewing.GEOMETRY_LOADED_EVENT // 几何体加载完成事件
Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT // 对象树创建完成事件
Autodesk.Viewing.TOOLBAR_CREATED_EVENT // 工具栏创建完成事件
Autodesk.Viewing.CAMERA_CHANGE_EVENT // 相机变更事件
Autodesk.Viewing.ISOLATE_EVENT // 隔离事件
```

## 四、构件操作

### 1. 获取构件属性

```javascript
// 获取构件属性
viewer.getProperties(dbId, function (result) {
  console.log('构件名称:', result.name)
  console.log('构件属性:', result.properties)
})
```

### 2. 构件变色

```javascript
// 设置构件颜色
var color = new THREE.Vector4(1, 0, 0, 0.5) // RGBA颜色值(0-1范围)
viewer.setThemingColor(dbId, color)

// 清除特定构件的颜色
viewer.setThemingColor(dbId, null)

// 清除所有构件颜色
viewer.clearThemingColors()

// 批量设置颜色(性能优化)
var model = viewer.model
model.setThemingColor(dbId1, color1)
model.setThemingColor(dbId2, color2)
// 手动触发渲染
viewer.impl.invalidate(true)

// 递归设置子构件颜色
viewer.setThemingColor(dbId, color, null, true) // 第四个参数为true表示递归
```

### 3. 构件选择

```javascript
// 选择构件
viewer.select(dbIds) // dbIds可以是单个ID或ID数组

// 获取当前选择
var selection = viewer.getSelection()

// 清除选择
viewer.clearSelection()

// 隔离构件
viewer.isolate(dbIds)

// 显示所有构件
viewer.showAll()

// 隐藏构件
viewer.hide(dbIds)

// 显示构件
viewer.show(dbIds)
```

## 五、视图操作

### 1. 相机控制

```javascript
// 获取当前相机状态
var camera = viewer.getCamera()

// 设置相机
viewer.setView(camera)

// 适应视图(显示所有内容)
viewer.fitToView()

// 适应特定构件
viewer.fitToView(dbIds)

// 设置视图为前、后、左、右、上、下视图
viewer.setViewFromFile() // 默认视图
viewer.setViewCube('front')
viewer.setViewCube('back')
viewer.setViewCube('left')
viewer.setViewCube('right')
viewer.setViewCube('top')
viewer.setViewCube('bottom')
```

### 2. 截面工具

```javascript
// 获取截面工具扩展
viewer.loadExtension('Autodesk.Section').then(function (sectionExt) {
  // 创建截面平面
  var normal = { x: 1, y: 0, z: 0 } // 法线方向
  sectionExt.createSectionPlane(normal)

  // 激活截面工具
  var toolName = sectionExt.getName()
  viewer.toolController.activateTool(toolName)

  // 移除截面平面
  sectionExt.deleteSectionPlane()
})
```

## 六、模型树操作

### 1. 获取模型树

```javascript
// 获取实例树
var instanceTree = viewer.model.getInstanceTree()

// 遍历模型树
function traverseTree(dbId) {
  instanceTree.enumNodeChildren(dbId, function (childId) {
    console.log('子节点ID:', childId)
    // 递归遍历
    traverseTree(childId)
  })
}

// 从根节点开始遍历
var rootId = instanceTree.getRootId()
traverseTree(rootId)
```

### 2. 模型树查询

```javascript
// 获取父节点
var parentId = instanceTree.getNodeParentId(dbId)

// 获取节点名称
var nodeName = instanceTree.getNodeName(dbId)

// 检查节点是否可见
var isVisible = instanceTree.isNodeVisible(dbId)

// 获取节点类型
var objectCount = 0
instanceTree.getNodeType(dbId, function (objectId) {
  objectCount++
})
```

## 七、离线部署

### 1. 离线部署方案

```html
<!-- 引入本地Viewer资源 -->
<link rel="stylesheet" href="./libs/style.css" />
<script src="./libs/viewer3D.js"></script>

<script>
  // 配置离线环境
  var options = {
    env: 'Local',
    document: './models/0.svf' // 本地SVF文件路径
  }

  // 初始化Viewer
  Autodesk.Viewing.Initializer(options, function () {
    var viewer = new Autodesk.Viewing.Viewer3D(
      document.getElementById('viewerContainer')
    )
    viewer.start()
    viewer.loadModel(options.document)
  })
</script>
```

### 2. SVF 模型提取

可以通过以下方式获取 SVF 格式模型：

1. 使用 Autodesk 提供的 Extractor 应用程序
2. 使用 Forge Model Derivative API 转换模型
3. 使用 VS Code 扩展"Autodesk Forge Tools"转换模型
4. 使用 Forge Tools Hub 等工具下载已转换的 SVF 文件

## 八、扩展开发

### 1. 创建自定义扩展

```javascript
// 定义扩展
function MyExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options)
}

// 继承基类
MyExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype)
MyExtension.prototype.constructor = MyExtension

// 加载方法
MyExtension.prototype.load = function () {
  console.log('扩展加载')
  // 创建UI或添加功能
  return true
}

// 卸载方法
MyExtension.prototype.unload = function () {
  console.log('扩展卸载')
  // 清理资源
  return true
}

// 注册扩展
Autodesk.Viewing.theExtensionManager.registerExtension(
  'MyExtension',
  MyExtension
)
```

### 2. 加载扩展

```javascript
// 加载扩展
viewer.loadExtension('MyExtension').then(function (extension) {
  // 扩展加载完成后的操作
})

// 或在初始化时加载
var config = {
  extensions: ['MyExtension']
}
var viewer = new Autodesk.Viewing.Viewer3D(htmlElement, config)
```

## 九、实用工具方法

### 1. 颜色转换

```javascript
// 将RGB或HEX颜色转换为THREE.Vector4
function colorToVec4(colorString) {
  // 处理HEX格式
  if (colorString.startsWith('#')) {
    const r = parseInt(colorString.slice(1, 3), 16) / 255
    const g = parseInt(colorString.slice(3, 5), 16) / 255
    const b = parseInt(colorString.slice(5, 7), 16) / 255
    return new THREE.Vector4(r, g, b, 1)
  }

  // 处理RGB/RGBA格式
  if (colorString.startsWith('rgb')) {
    const values = colorString.match(/[\d.]+/g)
    const r = parseInt(values[0]) / 255
    const g = parseInt(values[1]) / 255
    const b = parseInt(values[2]) / 255
    const a = values.length > 3 ? parseFloat(values[3]) : 1
    return new THREE.Vector4(r, g, b, a)
  }

  return new THREE.Vector4(1, 1, 1, 1) // 默认白色
}

// 使用示例
const redColor = colorToVec4('#FF0000')
const blueWithAlpha = colorToVec4('rgba(0, 0, 255, 0.5)')
```

### 2. 性能优化

```javascript
// 批量处理构件颜色
function batchSetColors(viewer, colorMap) {
  // 暂停自动渲染
  viewer.impl.pauseRendering()

  // 批量设置颜色
  const model = viewer.model
  for (const [dbId, color] of Object.entries(colorMap)) {
    model.setThemingColor(parseInt(dbId), color)
  }

  // 恢复渲染并强制更新
  viewer.impl.resumeRendering()
  viewer.impl.invalidate(true)
}

// 使用示例
const colorMap = {
  123: new THREE.Vector4(1, 0, 0, 1),
  456: new THREE.Vector4(0, 1, 0, 1)
}
batchSetColors(viewer, colorMap)
```

## 十、常见问题与解决方案

### 1. 与 Vue 等框架集成时的注意事项

```javascript
// 在Vue组件中使用Viewer3D
import { markRaw, onMounted, onUnmounted, ref } from 'vue'

export default {
  setup() {
    const viewerRef = ref(null)
    const viewer = ref(null)

    // 将对象转换为非响应式
    const toRaw = (value) => {
      if (value && typeof value === 'object' && value.__v_raw) {
        return value.__v_raw
      }
      return value
    }

    onMounted(async () => {
      // 初始化Viewer
      Autodesk.Viewing.Initializer(options, () => {
        // 使用markRaw避免Vue将viewer实例转换为响应式对象
        const viewerInstance = new Autodesk.Viewing.Viewer3D(viewerRef.value)
        viewerInstance.start()

        // 存储原始非响应式实例
        viewer.value = markRaw(viewerInstance)
      })
    })

    onUnmounted(() => {
      // 清理资源
      if (viewer.value) {
        const viewerInstance = toRaw(viewer.value)
        if (viewerInstance.model) {
          viewerInstance.unloadModel(viewerInstance.model)
        }
        viewerInstance.finish()
        viewer.value = null
      }
    })

    return { viewerRef }
  }
}
```

### 2. 模型加载失败排查

```javascript
// 添加详细的错误处理
function loadModel(viewer, documentId) {
  Autodesk.Viewing.Document.load(
    documentId,
    (doc) => {
      const viewables = doc.getRoot().getDefaultGeometry()
      if (!viewables) {
        console.error('模型没有可查看的几何体')
        return
      }
      viewer.loadDocumentNode(doc, viewables)
    },
    (errorCode, errorMsg, errors) => {
      // 详细错误信息
      console.error('加载错误码:', errorCode)
      console.error('错误信息:', errorMsg)
      console.error('详细错误:', errors)

      // 常见错误码处理
      switch (errorCode) {
        case 1:
          console.error('无效的文档ID')
          break
        case 2:
          console.error('网络连接问题')
          break
        // 其他错误码...
      }
    }
  )
}
```

以上就是 Autodesk Viewer3D API 的主要参数、属性和方法的使用方法。这些 API 可以帮助您实现模型的加载、交互、自定义功能等各种需求。在实际应用中，您可以根据需要组合使用这些 API，构建功能丰富的 3D 模型查看应用。

```javascript
// 1. 初始化Viewer环境
Autodesk.Viewing.Initializer(options, function () {
  // 2. 创建Viewer实例
  var viewer = new Autodesk.Viewing.Viewer3D(htmlElement, config)
  viewer.start() // 启动Viewer
  // 加载模型
})
```

```javascript
// Initializer参数
var options = {
  env: 'AutodeskProduction', // 环境：'AutodeskProduction'或'Local'(离线模式)
  getAccessToken: function (callback) {
    // 获取访问令牌的函数
    callback('访问令牌', 3600) // 令牌和过期时间(秒)
  },
  useADP: false // 是否使用ADP
}

// Viewer3D构造函数参数
var config = {
  extensions: ['Autodesk.DocumentBrowser'], // 要加载的扩展
  theme: 'light-theme' // 主题：'light-theme'或'dark-theme'
}
```

```javascript
// 离线模式配置
var options = {
  env: 'Local', // 使用本地环境
  document: './model/0.svf' // 本地SVF文件路径
}
```

```javascript
// 通过URN加载模型
Autodesk.Viewing.Document.load(
  'urn:' + modelUrn,
  // 成功回调
  function (doc) {
    var viewables = doc.getRoot().getDefaultGeometry()
    viewer.loadDocumentNode(doc, viewables)
  },
  // 失败回调
  function (errorCode, errorMsg) {
    console.error('模型加载失败:', errorCode, errorMsg)
  }
)
```

```javascript
// 直接加载本地SVF文件
viewer.loadModel(
  './model/0.svf',
  {},
  // 成功回调
  function (model) {
    console.log('模型加载成功')
  },
  // 失败回调
  function (errorCode) {
    console.error('模型加载失败:', errorCode)
  }
)
```

```javascript
// 添加事件监听
viewer.addEventListener(
  Autodesk.Viewing.SELECTION_CHANGED_EVENT,
  onSelectionChanged
)
viewer.addEventListener(
  Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
  onGeometryLoaded
)

// 事件处理函数
function onSelectionChanged(event) {
  // event.dbIdArray 包含选中构件的ID数组
  console.log('选中的构件ID:', event.dbIdArray)

  if (event.dbIdArray.length === 1) {
    // 获取选中构件的属性
    viewer.getProperties(event.dbIdArray[0], function (data) {
      console.log('构件属性:', data)
    })
  }
}

function onGeometryLoaded() {
  console.log('几何体加载完成')
  // 模型加载完成后的操作
}
```

```javascript
// 常用事件类型
Autodesk.Viewing.SELECTION_CHANGED_EVENT // 选择变更事件
Autodesk.Viewing.GEOMETRY_LOADED_EVENT // 几何体加载完成事件
Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT // 对象树创建完成事件
Autodesk.Viewing.TOOLBAR_CREATED_EVENT // 工具栏创建完成事件
Autodesk.Viewing.CAMERA_CHANGE_EVENT // 相机变更事件
Autodesk.Viewing.ISOLATE_EVENT // 隔离事件
```

```javascript
// 获取构件属性
viewer.getProperties(dbId, function (result) {
  console.log('构件名称:', result.name)
  console.log('构件属性:', result.properties)
})
```

```javascript
// 设置构件颜色
var color = new THREE.Vector4(1, 0, 0, 0.5) // RGBA颜色值(0-1范围)
viewer.setThemingColor(dbId, color)

// 清除特定构件的颜色
viewer.setThemingColor(dbId, null)

// 清除所有构件颜色
viewer.clearThemingColors()

// 批量设置颜色(性能优化)
var model = viewer.model
model.setThemingColor(dbId1, color1)
model.setThemingColor(dbId2, color2)
// 手动触发渲染
viewer.impl.invalidate(true)

// 递归设置子构件颜色
viewer.setThemingColor(dbId, color, null, true) // 第四个参数为true表示递归
```

```javascript
// 选择构件
viewer.select(dbIds) // dbIds可以是单个ID或ID数组

// 获取当前选择
var selection = viewer.getSelection()

// 清除选择
viewer.clearSelection()

// 隔离构件
viewer.isolate(dbIds)

// 显示所有构件
viewer.showAll()

// 隐藏构件
viewer.hide(dbIds)

// 显示构件
viewer.show(dbIds)
```

```javascript
// 获取当前相机状态
var camera = viewer.getCamera()

// 设置相机
viewer.setView(camera)

// 适应视图(显示所有内容)
viewer.fitToView()

// 适应特定构件
viewer.fitToView(dbIds)

// 设置视图为前、后、左、右、上、下视图
viewer.setViewFromFile() // 默认视图
viewer.setViewCube('front')
viewer.setViewCube('back')
viewer.setViewCube('left')
viewer.setViewCube('right')
viewer.setViewCube('top')
viewer.setViewCube('bottom')
```

```javascript
// 获取截面工具扩展
viewer.loadExtension('Autodesk.Section').then(function (sectionExt) {
  // 创建截面平面
  var normal = { x: 1, y: 0, z: 0 } // 法线方向
  sectionExt.createSectionPlane(normal)

  // 激活截面工具
  var toolName = sectionExt.getName()
  viewer.toolController.activateTool(toolName)

  // 移除截面平面
  sectionExt.deleteSectionPlane()
})
```

```javascript
// 获取实例树
var instanceTree = viewer.model.getInstanceTree()

// 遍历模型树
function traverseTree(dbId) {
  instanceTree.enumNodeChildren(dbId, function (childId) {
    console.log('子节点ID:', childId)
    // 递归遍历
    traverseTree(childId)
  })
}

// 从根节点开始遍历
var rootId = instanceTree.getRootId()
traverseTree(rootId)
```

```javascript
// 获取父节点
var parentId = instanceTree.getNodeParentId(dbId)

// 获取节点名称
var nodeName = instanceTree.getNodeName(dbId)

// 检查节点是否可见
var isVisible = instanceTree.isNodeVisible(dbId)

// 获取节点类型
var objectCount = 0
instanceTree.getNodeType(dbId, function (objectId) {
  objectCount++
})
```

```html
<!-- 引入本地Viewer资源 -->
<link rel="stylesheet" href="./libs/style.css" />
<script src="./libs/viewer3D.js"></script>

<script>
  // 配置离线环境
  var options = {
    env: 'Local',
    document: './models/0.svf' // 本地SVF文件路径
  }

  // 初始化Viewer
  Autodesk.Viewing.Initializer(options, function () {
    var viewer = new Autodesk.Viewing.Viewer3D(
      document.getElementById('viewerContainer')
    )
    viewer.start()
    viewer.loadModel(options.document)
  })
</script>
```

```javascript
// 定义扩展
function MyExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options)
}

// 继承基类
MyExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype)
MyExtension.prototype.constructor = MyExtension

// 加载方法
MyExtension.prototype.load = function () {
  console.log('扩展加载')
  // 创建UI或添加功能
  return true
}

// 卸载方法
MyExtension.prototype.unload = function () {
  console.log('扩展卸载')
  // 清理资源
  return true
}

// 注册扩展
Autodesk.Viewing.theExtensionManager.registerExtension(
  'MyExtension',
  MyExtension
)
```

```javascript
// 加载扩展
viewer.loadExtension('MyExtension').then(function (extension) {
  // 扩展加载完成后的操作
})

// 或在初始化时加载
var config = {
  extensions: ['MyExtension']
}
var viewer = new Autodesk.Viewing.Viewer3D(htmlElement, config)
```

```javascript
// 将RGB或HEX颜色转换为THREE.Vector4
function colorToVec4(colorString) {
  // 处理HEX格式
  if (colorString.startsWith('#')) {
    const r = parseInt(colorString.slice(1, 3), 16) / 255
    const g = parseInt(colorString.slice(3, 5), 16) / 255
    const b = parseInt(colorString.slice(5, 7), 16) / 255
    return new THREE.Vector4(r, g, b, 1)
  }

  // 处理RGB/RGBA格式
  if (colorString.startsWith('rgb')) {
    const values = colorString.match(/[\d.]+/g)
    const r = parseInt(values[0]) / 255
    const g = parseInt(values[1]) / 255
    const b = parseInt(values[2]) / 255
    const a = values.length > 3 ? parseFloat(values[3]) : 1
    return new THREE.Vector4(r, g, b, a)
  }

  return new THREE.Vector4(1, 1, 1, 1) // 默认白色
}

// 使用示例
const redColor = colorToVec4('#FF0000')
const blueWithAlpha = colorToVec4('rgba(0, 0, 255, 0.5)')
```

```javascript
// 批量处理构件颜色
function batchSetColors(viewer, colorMap) {
  // 暂停自动渲染
  viewer.impl.pauseRendering()

  // 批量设置颜色
  const model = viewer.model
  for (const [dbId, color] of Object.entries(colorMap)) {
    model.setThemingColor(parseInt(dbId), color)
  }

  // 恢复渲染并强制更新
  viewer.impl.resumeRendering()
  viewer.impl.invalidate(true)
}

// 使用示例
const colorMap = {
  123: new THREE.Vector4(1, 0, 0, 1),
  456: new THREE.Vector4(0, 1, 0, 1)
}
batchSetColors(viewer, colorMap)
```

```javascript
// 在Vue组件中使用Viewer3D
import { markRaw, onMounted, onUnmounted, ref } from 'vue'

export default {
  setup() {
    const viewerRef = ref(null)
    const viewer = ref(null)

    // 将对象转换为非响应式
    const toRaw = (value) => {
      if (value && typeof value === 'object' && value.__v_raw) {
        return value.__v_raw
      }
      return value
    }

    onMounted(async () => {
      // 初始化Viewer
      Autodesk.Viewing.Initializer(options, () => {
        // 使用markRaw避免Vue将viewer实例转换为响应式对象
        const viewerInstance = new Autodesk.Viewing.Viewer3D(viewerRef.value)
        viewerInstance.start()

        // 存储原始非响应式实例
        viewer.value = markRaw(viewerInstance)
      })
    })

    onUnmounted(() => {
      // 清理资源
      if (viewer.value) {
        const viewerInstance = toRaw(viewer.value)
        if (viewerInstance.model) {
          viewerInstance.unloadModel(viewerInstance.model)
        }
        viewerInstance.finish()
        viewer.value = null
      }
    })

    return { viewerRef }
  }
}
```

```javascript
// 添加详细的错误处理
function loadModel(viewer, documentId) {
  Autodesk.Viewing.Document.load(
    documentId,
    (doc) => {
      const viewables = doc.getRoot().getDefaultGeometry()
      if (!viewables) {
        console.error('模型没有可查看的几何体')
        return
      }
      viewer.loadDocumentNode(doc, viewables)
    },
    (errorCode, errorMsg, errors) => {
      // 详细错误信息
      console.error('加载错误码:', errorCode)
      console.error('错误信息:', errorMsg)
      console.error('详细错误:', errors)

      // 常见错误码处理
      switch (errorCode) {
        case 1:
          console.error('无效的文档ID')
          break
        case 2:
          console.error('网络连接问题')
          break
        // 其他错误码...
      }
    }
  )
}
```
