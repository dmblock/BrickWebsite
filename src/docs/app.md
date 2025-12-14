# 应用模板安装指南

## 获取模板

1. 访问 Brick 应用市场
2. 选择应用并下载
3. 保存为 `template.sh` 文件

## 安装方式

### 1. 翼龙面板

- 上传 `template.sh` 到实例根目录 `/home/container/`
- 可能需要部分可执行权限才能如常运行

### 2. Docker 环境

- 挂载或复制到容器：

```bash
docker cp template.sh 容器名:/home/container/
docker exec 容器名 chmod +x /home/container/template.sh
docker exec 容器名 /home/container/template.sh
```

### 3. 普通环境

- 放到用户家目录 `~/`
- 执行：

```bash
chmod +x ~/template.sh
```
