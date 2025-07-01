import kaggle 
import os
import boto3
from botocore.exceptions import ClientError

def donwload_data():
    if os.path.exists("apple_5yr_one.csv"):
        return
    kaggle.api.dataset_download_files(
    'samanfatima7/2020-2025-apple-stock-dataset', 
    path='.', 
    unzip=True
    )

def upload_data():

    donwload_data()

    s3_client = boto3.client('s3')
    bucket_name = "apple-stock-dataset"
    object_key = "apple_5yr_one.csv"
    key_file_path = "/Users/kareemsalem/Projects/UserTest/apple_5yr_one.csv"

    try:
        s3_client.create_bucket(Bucket=bucket_name)
    except ClientError as err:
        print(f"Tried and failed to create demo bucket {bucket_name}")
        print(f"\t{err.response['Error']}")
    
    try:
        s3_client.upload_file(key_file_path, bucket_name, object_key)

    except ClientError as err:
        print("Error creating S3 object: {err}")
