#!/bin/bash
# =======================================
# deploy.sh – Cập nhật website Khánh Linh
# Chạy: bash deploy.sh "Mô tả thay đổi"
# =======================================

MSG="${1:-cập nhật website}"

echo "🌸 Deploy website Khánh Linh..."
echo "📝 Commit: $MSG"

# Kiểm tra có thay đổi không
if git diff --quiet && git diff --staged --quiet; then
  echo "⚠️  Không có thay đổi gì để deploy."
  exit 0
fi

# Commit tất cả thay đổi
git add -A
git commit -m "🌸 $MSG"

# Đẩy mã nguồn lên GitHub (để Render & Vercel tự động deploy)
git push

# Deploy lên Vercel production trực tiếp (tùy chọn)
npx vercel --prod

echo ""
echo "✅ Deploy xong! Website đã cập nhật live."
