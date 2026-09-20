#!/bin/bash
# GitHub Pages 静态演示版发布：NEXT_EXPORT=1 导出 out/ → 推到 gh-pages 分支
# main 分支与本地/Vercel 运行模式不受影响；API 路由导出时临时移出（Pages 无后端）
# 用法：GH_TOKEN=<含 repo 写权限的 token> bash scripts/deploy-pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."

: "${GH_TOKEN:?请先 export GH_TOKEN=<token>}"
REPO="Newhgg/ai-campus"

# 1) 导出期临时移走 API 路由（Pages 是纯静态，跑不了 route handler）
ROOT="$(pwd)"
API_BACKUP="/tmp/ai-campus-api-backup-$$"
if [ -d app/api ]; then
  mv app/api "$API_BACKUP"
  trap 'mv "$API_BACKUP" "$ROOT/app/api"' EXIT
fi

# 2) 静态导出 → out/
NEXT_EXPORT=1 npm run build
touch out/.nojekyll

# 3) out/ 作为独立 git 仓库推送 gh-pages（带重试，抗网络抖动）
cd out
git init -q -b gh-pages
git add -A
git commit -qm "chore: GitHub Pages 静态演示版（自动发布 $(date +%F_%H:%M)）"
ok=0
for i in 1 2 3 4 5; do
  echo "--- 推送尝试 $i ---"
  if git -c credential.helper= -c http.version=HTTP/1.1 -c http.postBuffer=524288000 \
      push "https://Newhgg:${GH_TOKEN}@github.com/${REPO}.git" gh-pages:gh-pages; then
    ok=1; break
  fi
  sleep 8
done
[ "$ok" = 1 ] || { echo "推送失败：网络或权限问题"; exit 1; }
echo "OK: https://newhgg.github.io/ai-campus/ （Pages 首次生效约 1-2 分钟）"
