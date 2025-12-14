# Docker 部署指南

## 快速开始

### 1. 拉取镜像

```bash
docker pull codespace.lantian.pro/lantiancloud/brickcontainer/brick:1.0
```

### 2. 启动容器

使用 Docker 命令直接启动：

```bash
docker run --restart always -itd \
  --name brick-container \
  -v /宿主机/数据路径:/home/container \
  -e REPO=nju \
  -e PORT=8080 \
  -e PASSWORD=your_password_here \
  -e INSTALL_MODE=online \
  -e STARTUP='brick' \
  codespace.lantian.pro/lantiancloud/brickcontainer/brick:1.0
```

### 3. 重新进入容器终端

```bash
docker attach brick-container
```

## Docker Compose 部署（推荐）

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  brick:
    image: codespace.lantian.pro/lantiancloud/brickcontainer/brick:1.0
    container_name: brick-container
    restart: unless-stopped
    stdin_open: true
    tty: true
    volumes:
      - ./data:/home/container
    environment:
      - REPO=nju
      - PORT=8080
      - PASSWORD=your_secure_password
      - INSTALL_MODE=online
      - STARTUP=brick
```

启动服务：

```bash
docker-compose up -d
```

## 参数说明

| 参数           | 说明           | 示例                          |
| -------------- | -------------- | ----------------------------- |
| `REPO`         | 仓库名称       | `nju`                         |
| `PORT`         | 服务端口号     | `8080`                        |
| `PASSWORD`     | 访问密码       | `your_password_here`          |
| `INSTALL_MODE` | 安装模式       | `online`                      |
| 数据卷映射     | 容器数据持久化 | `/宿主机路径:/home/container` |

## 常用命令

```bash
# 查看容器日志
docker logs brick-container

# 进入容器交互模式
docker exec -it brick-container /bin/bash

# 停止容器
docker stop brick-container

# 启动容器
docker start brick-container

# 删除容器
docker rm brick-container

# Docker Compose 管理
docker-compose down    # 停止并删除容器
docker-compose logs    # 查看日志
docker-compose ps      # 查看状态
```

## 注意事项

1. **数据持久化**：务必配置数据卷映射（`-v` 参数），避免容器重启后数据丢失
2. **密码安全**：请将 `your_password_here` 替换为强密码
3. **端口映射**：如需从宿主机访问，需添加端口映射参数：
   ```bash
   -p 8080:8080
   ```
4. **资源限制**：生产环境建议添加资源限制：
   ```bash
   --memory=2g --cpus=2
   ```

## 故障排查

1. **容器无法启动**：检查端口是否被占用
2. **无法连接服务**：确认防火墙设置和端口映射
3. **数据丢失**：验证数据卷映射是否正确配置
4. **查看详细日志**：
   ```bash
   docker logs --tail 50 brick-container
   ```

---

**提示**：建议使用 Docker Compose 方式进行部署，便于管理和维护。
