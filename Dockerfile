FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install 
RUN npm install pm2 -g
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["pm2-runtime", "dist/App.js"] 