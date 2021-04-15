FROM node:12.16

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# Update & install pdftk
RUN apt-get update
RUN apt-get install -y pdftk

# Setup
WORKDIR /usr/src/app
COPY . .

EXPOSE 3100

CMD ["npm", "run", "start"]
