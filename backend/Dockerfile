FROM node:12.22.12-bullseye

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# Update & install pdftk
RUN apt-get update
RUN apt-get install -y pdftk

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci

# pdftk fails otherwise
RUN chmod -R 777 node_modules

COPY . .

EXPOSE 3100

CMD ["npm", "run", "start:prod"]
