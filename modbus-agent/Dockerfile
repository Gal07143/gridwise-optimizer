# ✅ Base image
FROM node:18

# ✅ Set working directory
WORKDIR /app

# ✅ Copy and install dependencies
COPY package*.json ./
RUN npm install

# ✅ Copy the rest of the code
COPY . .

# ✅ Set environment variables (you’ll override these later with .env or Docker Compose)
ENV NODE_ENV=production

# ✅ Start the agent
CMD ["node", "index.js"]
