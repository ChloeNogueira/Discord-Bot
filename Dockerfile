FROM node:latest
#create the directory
RUN mkdir /bot
WORKDIR /bot

#copy and install our bot
COPY package*.json ./
RUN npm install

# Copy the bot
COPY index.js /bot/index.js
COPY config.json /bot/config.json

EXPOSE 80

# Start the application
CMD ["node","index.js"]