FROM node:10.15.0

# Setup
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm ci

RUN npm run build
RUN npm install -g serve

EXPOSE 5000

RUN echo "Set root path to ${ROOT_PATH:-v2}"
RUN sed -i -e "s/\/static/\/${ROOT_PATH:-v2}\/static/g" build/index.html

CMD serve -l 5000 -s build
