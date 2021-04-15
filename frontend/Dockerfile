FROM node:10.15.0

# Setup
WORKDIR /usr/src/app
COPY . .

RUN npm ci

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

RUN npm run build
RUN npm install -g serve

EXPOSE 5000

CMD serve -l 5000 -s build
