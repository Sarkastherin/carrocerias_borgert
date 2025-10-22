# Verificamos que haya un mensaje de commit
if [ -z "$1" ]; then
  echo "⚠️  Debés ingresar un mensaje de commit como argumento."
  echo "Uso: npm run deploy -- 'mensaje' [patch|minor|major]"
  exit 1
fi
# Comenzamos con los cambios
git add .
git commit -m "$1"
git push origin main