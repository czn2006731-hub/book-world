#!/bin/bash
# Book Realm 一键部署脚本
set -e

IP="8.148.21.137"
USER="root"
PASS="A413996731888a"
DEST="/var/www/book-realm"
ROOT="$(cd "$(dirname "$0")" && pwd)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Book Realm Deploy${NC}"
echo -e "${CYAN}  Server: ${IP}${NC}"
echo -e "${CYAN}========================================${NC}"

# 封装 ssh/scp（优先用 sshpass，其次用密钥）
if command -v sshpass &>/dev/null; then
    SSH_CMD="sshpass -p '${PASS}' ssh -o StrictHostKeyChecking=no"
    SCP_CMD="sshpass -p '${PASS}' scp -o StrictHostKeyChecking=no -r"
elif ssh -o ConnectTimeout=3 -o StrictHostKeyChecking=no "${USER}@${IP}" "echo ok" &>/dev/null; then
    SSH_CMD="ssh -o StrictHostKeyChecking=no"
    SCP_CMD="scp -o StrictHostKeyChecking=no -r"
else
    echo -e "${RED}错误: 无法连接服务器。请安装 sshpass (apt install sshpass) 或配置 SSH 密钥。${NC}"
    exit 1
fi

if [ "$1" = "--restart" ]; then
    echo -e "${YELLOW}仅重启服务...${NC}"
    $SSH_CMD "${USER}@${IP}" "systemctl restart book-realm && systemctl status book-realm --no-pager | grep Active"
    echo -e "${GREEN}Done!${NC}"
    exit 0
fi

# 测试连接
echo -e "${YELLOW}[1/3] 连接服务器...${NC}"
if ! $SSH_CMD "${USER}@${IP}" "echo ok" &>/dev/null; then
    echo -e "${RED}SSH 连接失败！${NC}"
    exit 1
fi
echo -e "${GREEN}  连接成功${NC}"

# 创建目录
$SSH_CMD "${USER}@${IP}" "mkdir -p $DEST/css $DEST/js $DEST/assets/covers $DEST/server/routes $DEST/server/data"

echo -e "${YELLOW}[2/3] 上传文件...${NC}"

upload_file() {
    local src="$1"
    local dst="$2"
    echo -n "  $src ... "
    if $SCP_CMD "$src" "${USER}@${IP}:$dst" 2>/dev/null; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}失败！${NC}"
        return 1
    fi
}

echo "  frontend..."
upload_file "$ROOT/index.html" "$DEST/index.html" || true
for f in "$ROOT/css/"*; do
    [ -f "$f" ] && upload_file "$f" "$DEST/css/" || true
done
for f in "$ROOT/js/"*; do
    [ -f "$f" ] && upload_file "$f" "$DEST/js/" || true
done

echo "  assets..."
cd "$ROOT"
find assets -type f 2>/dev/null | while IFS= read -r f; do
    dir=$(dirname "$DEST/$f")
    $SSH_CMD "${USER}@${IP}" "mkdir -p \"$dir\"" &>/dev/null
    upload_file "$f" "$DEST/$f" || true
done

echo "  backend..."
[ -f "$ROOT/server/package.json" ] && upload_file "$ROOT/server/package.json" "$DEST/server/package.json" || true
[ -f "$ROOT/server/server.js" ] && upload_file "$ROOT/server/server.js" "$DEST/server/server.js" || true
for f in "$ROOT/server/routes/"*; do
    [ -f "$f" ] && upload_file "$f" "$DEST/server/routes/" || true
done
for f in "$ROOT/server/data/"*; do
    [ -f "$f" ] && upload_file "$f" "$DEST/server/data/" || true
done
[ -f "$ROOT/server/.env" ] && upload_file "$ROOT/server/.env" "$DEST/server/.env" || true

echo -e "${YELLOW}[3/3] 重启服务...${NC}"
$SSH_CMD "${USER}@${IP}" "cd $DEST/server && npm install --production 2>&1 | tail -1; systemctl restart book-realm; sleep 1; curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/; echo ''"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy OK!${NC}"
echo -e "${GREEN}  http://${IP}/book-realm${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}提示: 浏览器打开后请 Ctrl+Shift+R 硬刷新${NC}"
