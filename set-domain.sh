#!/usr/bin/env sh
# Uso:  ./set-domain.sh https://mi-proyecto.vercel.app
# Reemplaza el dominio en todos los archivos que lo necesitan y vuelve a dejar listo el deploy.
set -e
[ -z "$1" ] && { echo "Falta la URL. Ej: ./set-domain.sh https://mi-proyecto.vercel.app"; exit 1; }
URL=$(printf '%s' "$1" | sed 's:/*$::')          # saca la barra final si la tiene
FILES="index.html privacidad.html terminos.html robots.txt sitemap.xml"
for f in $FILES; do
  [ -f "$f" ] || continue
  sed -i.bak "s|https://DOMINIO.COM|$URL|g" "$f" && rm -f "$f.bak"
done
echo "Listo. Dominio configurado en: $URL"
echo "Ahora: vercel --prod   (o push al repo)"
