FROM node:12.16

WORKDIR /usr/src/app

# Setup
COPY package* ./
RUN npm ci

ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

EXPOSE 5000

CMD ["npm", "start"]
