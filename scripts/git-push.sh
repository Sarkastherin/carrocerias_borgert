# Verificamos que haya un mensaje de commit
if [ -z "$1" ]; then
  echo "⚠️  Debés ingresar un mensaje de commit como argumento."
  echo "Uso: npm run deploy -- 'mensaje'"
  exit 1
fi
# Comenzamos con los cambios
git add .
git commit -m "$1"
# Aumentamos la versión patch
npm version patch
git push origin main --follow-tags