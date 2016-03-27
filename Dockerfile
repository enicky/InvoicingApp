FROM node:0.12-slim

MAINTAINER Markus Padourek <markus@artificial.io>


RUN apt-get update && apt-get install -y python2.7 python2.7-dev

RUN npm install -g sails grunt bower npm-check-updates
RUN mkdir /server

# Define mountable directories.
#VOLUME ["/server"]

# Define working directory.
WORKDIR /server

COPY package.json /server/package.json

RUN cd /server && npm install

COPY . /server

# Expose ports.
EXPOSE 1337

CMD ["sails", "lift"]
