rm -drf app node_modules .next
npm prune
npm cache clean --force
docker compose down --rmi all
docker compose build --no-cache
docker compose up -d --build --force-recreate
