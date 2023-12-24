# Only run this script to set up the .env for this simple server AFTER executing terraform apply in the terraform directory
# Make sure you have jq installed

#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Error: Exactly one parameter is required."
  echo "Usage: $0 <port>"
  exit 1
fi

# Get important values from terraform output
access_key=$(jq '.outputs.access_key_id.value' ../terraform/terraform.tfstate | tr -d '"')
secret_key=$(jq '.outputs.secret_access_key.value' ../terraform/terraform.tfstate | tr -d '"')
region=$(jq '.outputs.aws_region.value' ../terraform/terraform.tfstate | tr -d '"')
bucket=$(jq '.outputs.s3_bucket_name.value' ../terraform/terraform.tfstate | tr -d '"')
port=$1

# Path to .env file
ENV_FILE=".env"

# Clear the contents of the .env file
touch $ENV_FILE
echo "" > "$ENV_FILE"

# Define new contents for the .env file
cat <<EOL > "$ENV_FILE"
AWS_ACCESS_KEY_ID=$access_key
AWS_SECRET_ACCESS_KEY=$secret_key
AWS_REGION=$region
S3_BUCKET=$bucket
PORT=$port
EOL

exit 0