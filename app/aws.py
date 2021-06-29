#################### IMPORTS ####################
import boto3
import botocore
import os
import uuid

#################### SETUP ####################
BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

s3 = boto3.client(
   "s3",
   aws_access_key_id=os.environ.get("S3_KEY"),
   aws_secret_access_key=os.environ.get("S3_SECRET")
)

#################### FUNCTIONS ####################
def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_unique_filename(filename, username):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = username+'_'+uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file_to_s3(file, acl="public-read"):
    try:
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # in case the our s3 upload fails
        return {"errors": str(e)}

    return {"url": f"{S3_LOCATION}{file.filename}"}



def delete_file_from_s3(key):
    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=key)
    except Exception as e:
        # in case the our s3 upload fails
        print('***********Errors*********',e)
        return {"errors": str(e)}

    return {"success": True}