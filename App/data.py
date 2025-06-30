import kaggle 
import io
import os
import uuid
import boto3
from boto3.s3.transfer import S3UploadFailedError
from botocore.exceptions import ClientError

def donwload_data():
    download = kaggle.api.dataset_download_files(
    'samanfatima7/2020-2025-apple-stock-dataset', 
    path='.', 
    unzip=True
    )
def upload_data():
    bucket_name = "apple-stock-dataset"
    bucket = s3_resource.Bucket(bucket_name)
    try:
        bucket.create(
            CreateBucketConfiguration{
                "LocationConstraint": s3_resource.meta.client.meta.region_name
            }
        )
    except ClientError as err:
        print(f"Tried and failed to create demo bucket {bucket_name}")
        print(f"\t{err.response['Error']}")
