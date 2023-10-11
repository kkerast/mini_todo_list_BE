FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start" ]