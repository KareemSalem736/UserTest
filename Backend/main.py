#App to test authentication using fastAPI

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import psycopg2

class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]

conn = psycopg2.connect(
    database="test",
    user="postgres",
    password="Aknjttr2015",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

memory_db = {"fruits": []}

@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

@app.post("/fruits", reponse_model=Fruit)
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit

@app.get("/")
async def root():
    cursor.execute("SELECT * FROM USER_TABLE")
    return {
        username : cursor.fetchone("USERNAME"),
         password : cursor.fetchone("PASSWORD"),
          first_name : cursor.fetchone("FIRST_NAME"),
           last_name : cursor.fetchone("LAST_NAME"),
            phone_number : cursor.fetchone("PHONE_NUMBER"),
             email : cursor.fetchone("EMAIL"),
              address : cursor.fetchone("ADDRESS")
            }

@app.post("/")
def root():
    return 

@app.put("/")
def root():
    return

@app.delete("/")
def root():
    return

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)