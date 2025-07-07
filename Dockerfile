# Use official Python base image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY fastapi-app ./fastapi-app
COPY startup.sh ./startup.sh

# Make sure the script is executable
RUN chmod +x ./startup.sh

# Expose the port FastAPI will run on
EXPOSE 8000

# Run the startup script
CMD ["./startup.sh"]
