from fastapi import FastAPI
from azure.storage.blob import BlobServiceClient
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = os.getenv("CALL_SUMMARY_CONTAINER", "call-summary")

blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)


@app.get("/list-calls")
async def list_calls():
    try:
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        blobs = container_client.list_blobs(name_starts_with="call-summary/")

        call_data = []

        for blob in blobs:
            blob_client = container_client.get_blob_client(blob)
            content = blob_client.download_blob().readall()
            try:
                data = json.loads(content)
                call_data.append(data)
            except Exception as e:
                print(f"⚠️ Erreur de parsing du fichier {blob.name}: {e}")
                continue

        def urgence_priority(val):
            priority_map = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
            return priority_map.get(val.get("urgence", "P3"), 4)

        sorted_data = sorted(call_data, key=urgence_priority)

        return {"status": "success", "results": sorted_data}

    except Exception as e:
        print(f"❌ Erreur dans list_calls: {e}")
        return {"status": "error", "message": str(e)}
