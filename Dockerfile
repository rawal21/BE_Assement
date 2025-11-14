# ✅ Use Debian-based Node image (not Alpine — bcrypt works fine here)
FROM node:20-bullseye

# Set working directory
WORKDIR /app/backend

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Copy rest of the code
COPY . .

# If you're using TypeScript, build it here (optional)
RUN npm run build

# Rebuild bcrypt for the container’s architecture
RUN npm rebuild bcrypt --build-from-source

# Expose your backend port
EXPOSE 5000

# Start the app (change to npm run start if you have a production script)
CMD ["npm", "run", "dev"]
