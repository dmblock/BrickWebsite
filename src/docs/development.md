# 参与开发

# 应用模板开发文档

# QQ交流群: 1046054360

## 📋 开发要求

### 必需文件

每个模板必须包含以下3个文件：

```
/[系统名称]/
├── brick.json          # 仓库描述信息
├── template.sh         # 主模板脚本
└── README.md           # 模板详细文档
```

### 文件命名规范

```
结构：/index/[系统]/[版本]/[变种]/文件
示例：/index/debian/13/ssh/brick.json
```

## 🛠 开发环境

### 推荐方式

建议在在线编辑器（如GitHub Codespaces、GitPod等）进行开发

### 开发流程

1. **克隆仓库**：Fork官方模板仓库到个人账户
2. **本地开发**：在在线编辑器中修改文件
3. **提交PR**：向官方仓库发起Pull Request
4. **审核上线**：审核通过后自动同步到BrickHub

## 📄 文件规范详解

### 1. brick.json 配置

```json
{
  "name": "模板显示名称",
  "description": "简短描述",
  "os": "系统名称", // 如：debian、ubuntu
  "version": "版本号", // 如：13、20.04
  "variant": "变种标识", // 如：ssh、web
  "release": "版本号", // 如：v1.0.0
  "author": "开发者名称",
  "contact": "联系方式"
}
```

### 2. template.sh 模板脚本结构

```bash
#!/bin/bash

# 导入SDK（必须）
if [[ ! -z "$DEV" ]]; then
    source sdk.sh
else
    source /usr/lib/brick/sdk.sh
fi

# 注册模板信息（必须）
register "模板名称" "版本" "作者" "联系方式"

# 构建参数
OS="系统名称"
VERSION="版本"
TYPE="类型"
USER="默认用户名"

# 容器配置
CONTAINER_ROOT=true/false
CONTAINER_PATH="路径"
CONTAINER_HOME="家目录"

# 模板安装函数（必须）
function release_install() {
    SHELL "/bin/bash"
    log INFO "安装提示信息..."
    RUN "安装命令"
}

# 容器启动函数（必须）
function start_container() {
    SHELL "/bin/bash"
    log INFO "启动提示信息..."
    RUN "启动命令"
}

# 主函数（必须）
main
```

### 3. README.md 文档

必须包含：

- 模板概述
- 核心信息表
- 功能特性
- 快速使用指南
- 配置选项说明

## 🔧 SDK函数说明

### 核心函数

```bash
# 日志输出
log INFO "信息"
log WARN "警告"
log ERROR "错误"

# 执行命令
RUN "命令"

# 设置Shell
SHELL "/bin/bash"

# 注册模板
register "名称" "版本" "作者" "联系方式"
```

### 可用变量

```bash
$PORT        # 分配的端口
$PASSWORD    # 生成的密码
$USER        # 用户变量
$CONTAINER_* # 容器配置
```

## 📦 发布流程

### 步骤

1. **准备模板**：按照规范创建三个文件
2. **测试验证**：本地或测试环境验证功能
3. **提交仓库**：Push到个人Fork的仓库
4. **发起PR**：向官方仓库提交Pull Request
5. **等待审核**：管理员审核模板内容
6. **自动上线**：审核通过后自动发布到BrickHub

### 审核要点

- 文件结构完整性
- 脚本安全性检查
- 功能可用性验证
- 文档清晰度评估

## ⚠️ 注意事项

1. **安全性**：避免硬编码密码，使用$PASSWORD变量
2. **兼容性**：确保命令在不同系统版本可用
3. **错误处理**：脚本应有适当的错误处理
4. **资源清理**：安装过程应清理临时文件
5. **日志输出**：关键步骤需有日志记录

## 📞 支持与反馈

- 开发问题：在PR中说明
- 模板建议：提交Issue
- 紧急问题：联系官方维护者

---

通过以上规范开发的模板，审核通过后将自动上线到BrickHub应用市场，供所有用户使用。
