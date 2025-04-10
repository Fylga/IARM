# The Dockerfile solely should be used for local deployment with a .env

FROM python:3.13

WORKDIR /code

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["./startup.sh"]