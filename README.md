# Session Aware Bingo

Tracks a users bingo progress, all users poll the status of each other and are notified when there's a winner!

## Style

* Line 12123 in `sketchy_bootstrap.css` is commented out

### Colors

Blue: #406ba0
Red/Pink: #e7284e
Gray: #1b1e21
Darker Gray: #181818

## Docker 

1. Build the app using the dockerfile. The _-t_ is th tag. `docker build -t bingo .`
2. Run the application `docker run -d --name bingo -p 8050:8000 -u 1000:1000 -v /mnt/docker/bingo/app:/app bingo`
3. Verify the container is running `docker ps -a`
4. View the container logs if necessary `docker logs bingo`

## Virtual Envrionment

1. `python -m venv venv`
2. `./venv/Scripts/activate` on Windows
3. `pip install -r requirements.txt`

## HTTP Basic Password

1. `dnf install httpd-tools`
2. `htpasswd -c /etc/nginx/.htpasswd test` - username is _test_

> NOTE: bingowashisnameo is the password I used


## Resources

1. [Socket.io - Javascript](https://socket.io/get-started/chat/)
2. [Flask SocketIO](https://flask-socketio.readthedocs.io/en/latest/)