# start by pulling the python image
FROM python:3.8-alpine

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY ./app /app

# configure the container to run in an executed manner
ENTRYPOINT [ "python" ]

# Run with Gunicorn - https://flask-socketio.readthedocs.io/en/latest/deployment.html#gunicorn-web-server
CMD ["/usr/local/bin/gunicorn", "-k", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "-w", "1", "-b", "0.0.0.0:5000", "app:app"]
