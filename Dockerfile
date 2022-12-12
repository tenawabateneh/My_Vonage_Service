# FROM node:lts-alpine

# # install simple http server for serving static content
# RUN npm install -g http-server

# # make the 'app' folder the current working directory
# WORKDIR /app

# # copy both 'package.json' and 'package-lock.json' (if available)
# COPY package*.json ./

# # install project dependencies
# RUN npm install

# # copy project files and folders to the current working directory (i.e. 'app' folder)
# COPY . .

# # build app for production with minification
# RUN npm run build

# EXPOSE 3000
# CMD [ "http-server", "dist" ]

# used the newest node version 
# FROM node:14

# Create app directory
# WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

# RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
# COPY . .

#EXPOSE 8080
# Changed to work with my socket.io server.js
# EXPOSE 3000
# CMD [ "npm", "start" ]

FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000
CMD ["npm", "start"]