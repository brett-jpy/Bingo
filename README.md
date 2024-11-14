# Bingo
Bingo - Attempts to beaware of other user's winning the game

## Docker 

1. Build the app using the dockerfile. The _-t_ is th tag. `docker build -t bingo .`
2. Run the application `docker run -d --name bingo -p 8050:8000 -u 1000:1000 -v /opt/docker/bingo/app:/app bingo`
3. Verify the container is running `docker ps -a`
4. View the container logs if necessary `docker logs bingo`

## Virtual Envrionment

1. `python -m venv venv`
2. `./venv/Scripts/activate` on Windows
3. `pip install -r requirements.txt`

## HTTP Basic Password

1. `dnf install httpd-tools`
2. `htpasswd -c /etc/nginx/.htpasswd test` - the user in this case will be _test_
   1. You'll be prompted for a password after pressing _Enter_ 
