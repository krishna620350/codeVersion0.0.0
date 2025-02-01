FROM node:16.20.1
WORKDIR /app
COPY package.json ./
RUN npm install
RUN echo "PORT=5002" > .env
COPY . .
EXPOSE 5002
CMD [ "npm", "run", "start" ]