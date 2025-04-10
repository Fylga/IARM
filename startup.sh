#!/bin/bash

export PYTHONPATH=./app
gunicorn -w 4 -k uvicorn.workers.UvicornWorker fastapi-app.main:app