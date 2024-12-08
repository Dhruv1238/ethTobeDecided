from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.responses import FileResponse, Response, RedirectResponse
import httpx
import subprocess
import random
from pathlib import Path


app = FastAPI()


# Environment variables for public aggregator and publisher
AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space"
PUBLISHER = "https://publisher.walrus-testnet.walrus.space"

@app.post("/store")
async def store_image(file: UploadFile, epochs: int = Form(1)):
    """
    Store an image in the public publisher.

    Args:
        file: The image file to upload.
        epochs: The number of epochs to store the blob.

    Returns:
        JSON response from the publisher.
    """
    try:
        # Ensure the file is an image
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files are supported.")
        
        # Upload the file using a PUT request
        url = f"{PUBLISHER}/v1/store?epochs={epochs}"
        async with httpx.AsyncClient() as client:
            response = await client.put(url, content=await file.read())

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


BLOB_IDS = [
    "Up3B5WtHG06f6bb8Qrf2zNNmixKQcEPFM-uJI1EoFzE",
    "5I1DYglEocvcA0nX0uPClHEBFFxz4a7YspbtoeihcvI",
    "KQ7VGN23gif1in3I0wVETV6tiqtwBmLF1vla8GNauH8",
    "KRv8f6lfvd9FxYlpAZ5DhnYdEMfu3yjUl-PtvqBYYSw",
    "PAnhlbndMMhGpbGYbJn24mbllXwYKXNzICe5oWACaYQ"
]


@app.get("/retrieve/{blob_id}")
async def retrieve_image(blob_id: str):
    """
    Retrieve an image from the public aggregator and display it in the browser.

    Args:
        blob_id: The ID of the blob to retrieve.

    Returns:
        The retrieved image content as a response.
    """
    try:
        # Define local file path
        output_path = Path("./output_image.png")

        # Build the curl command
        url = f"{AGGREGATOR}/v1/{blob_id}"
        result = subprocess.run(
            ["curl", url, "-o", str(output_path)],
            capture_output=True,
            text=True
        )

        # Check if curl executed successfully
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error with curl: {result.stderr}")

        # Check if the file exists and read its content
        if output_path.exists():
            image_content = output_path.read_bytes()
            return Response(content=image_content, media_type="image/png")
        else:
            raise HTTPException(status_code=404, detail="File could not be saved or retrieved.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/retrieverandom")
async def retrieve_random_blob():
    """
    Retrieve a random image from the public aggregator and display it in the browser.

    Returns:
        The retrieved random image content as a response.
    """
    # try:
    #     for _ in range(len(BLOB_IDS)):
    #         # Select a random blob ID from the list
    #         random_blob_id = random.choice(BLOB_IDS)
            
    #         # Try to retrieve the image using the retrieve_image function
    #         response = await retrieve_image(blob_id=random_blob_id)
            
    #         # Check if the response has valid content
    #         if response.body:
    #             return response
        
    #     # If all blob IDs fail, raise an exception
    #     raise HTTPException(status_code=404, detail="No valid image found in the random blob IDs.")

    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    try:
        # Define local file path
        output_path = Path("./output_image.png")

        # Build the curl command
        blob_id = random.choice(BLOB_IDS)
        url = f"{AGGREGATOR}/v1/{blob_id}"
        result = subprocess.run(
            ["curl", url, "-o", str(output_path)],
            capture_output=True,
            text=True
        )

        # Check if curl executed successfully
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error with curl: {result.stderr}")

        # Check if the file exists and read its content
        if output_path.exists():
            image_content = output_path.read_bytes()
            return Response(content=image_content, media_type="image/png")
        else:
            raise HTTPException(status_code=404, detail="File could not be saved or retrieved.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))