#!/bin/bash

export PYTHONPATH=./app
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend_app.main:app