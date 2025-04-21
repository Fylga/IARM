import logging
import azure.functions as func

@app.blob_trigger(arg_name="myblob", path="audio-calls/{name}",
                               connection="AzureWebJobsStorage") 
def handleCalls(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob"
                f"Name: {myblob.name}"
                f"Blob Size: {myblob.length} bytes")