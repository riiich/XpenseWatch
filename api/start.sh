sudo docker rm -f xpensewatch-api-dev || true
sudo docker build -t xpensewatch-api .
sudo docker run -d -p 5095:8080 -e ASPNETCORE_ENVIRONMENT=Development --name xpensewatch-api-dev xpensewatch-api

echo "----------------------------------------------------------------"
echo "Listening on http://localhost:5095/swagger.index.html"
sudo docker ps
