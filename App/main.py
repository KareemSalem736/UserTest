#App to test authentication using fastAPI

from fastapi import FastAPI
import psycopg2

conn = psycopg2.connect(
    database="test",
    user="postgres",
    password="Aknjttr2015",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

app = FastAPI()

@app.get("/")
def root():
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