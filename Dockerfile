FROM node:8.4.0

# Setup
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# Update
RUN apt-get update

RUN apt-get install -y pdftk

RUN npm i;

EXPOSE 3100

CMD ["node", "index.js"]
