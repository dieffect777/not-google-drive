FROM ubuntu:latest
RUN apt update
RUN apt install sudo
RUN sudo apt update
RUN sudo apt install -y curl
RUN sudo apt install -y nodejs
RUN sudo apt install -y npm
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN npm install -dev
COPY ["package.json", "package-lock.json*", "./client/"]
RUN npm install
RUN npm install -dev
COPY . .
CMD [ "npm", "run", "dev"]