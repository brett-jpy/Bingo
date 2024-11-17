# Session Aware Bingo

Tracks a users bingo progress, all users poll the status of each other and are notified when there's a winner!

## Style

> Line 12123 in `sketchy_bootstrap.css` is commented out purposefully

### Colors

* Blue: #406ba0
* Red/Pink: #e7284e
* Gray: #1b1e21
* Darker Gray: #181818

## Run the Application

Depending on the method you choose you may need to update the various config files (i.e., nginx) to ensure that the correct ports are detailed. 

### Docker 

1. Build the app using the dockerfile. The _-t_ is th tag. `docker build -t bingo .`
2. Run the application `docker run -d --name bingo -p 8050:5000 -u 1000:1000 -v /mnt/docker/bingo/app:/app bingo`
3. Verify the container is running `docker ps -a`
4. View the container logs if necessary `docker logs bingo`

### Virtual Envrionment

1. `python -m venv venv`
2. `./venv/Scripts/activate` on Windows or `source venv/bin/activate` on Linux
3. `pip install -r requirements.txt`

### HTTP Basic Password

1. `dnf install httpd-tools`
2. `htpasswd -c /etc/nginx/.htpasswd test` - username is _test_
3. Add the following lines to the nginx config

```conf
auth_basic "Restricted Content";
auth_basic_user_file /etc/nginx/.htpasswd;
```

### systemd

1. Copy the contents of _systemd_unit_file.service_ to `/etc/systemd/system/bingo.service` 
   1. Ensure directories are correct based on the location you setup the application 
2. `systemctl start bingo`

## Resources

1. [Socket.io - Javascript](https://socket.io/get-started/chat/)
2. [Flask SocketIO](https://flask-socketio.readthedocs.io/en/latest/)
3. [Sketchy - Bootwatch Theme](https://bootswatch.com/sketchy/)
4. [Bingo Board](https://github.com/Dharanz/Bingo)