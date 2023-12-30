import requests
import json

"""
Description: Get a presigned image upload URL from API and use it to upload an image to S3. Image can be provided as a local filepath or as a binary file. If both are provided, the binary file will be used.
Parameters:
  - image_key: unique key that will be used for fetching the image (think of it like a filename for the image)
  - local_image_filepath: absolute filepath of the image on local machine
  - image: binary image file
"""
def upload(image_key, local_image_filepath=None, image=None, api_ip='localhost', api_port=3000):
  # Validate parameters
  if not local_image_filepath and not image:
    raise ValueError('Please provide local_image_filepath or image.')
  
  # Validate API URL
  base_url = f'http://{api_ip}:{str(api_port)}/api'
  response = requests.get(base_url)
  if response.status_code != 200:
    raise ConnectionError('Invalid API URL. Please double check api_ip and api_port.')

  # Store image binary in image variable
  if not image:
    try:
      image = open(local_image_filepath, 'rb')
    except Exception as e:
      print(f'Error opening local image file: {e}')
  
  # Get presigned URL from API
  try:
    endpoint = f'/upload/{image_key}'
    response = requests.get(base_url + endpoint)
    upload_url = json.loads(response.content)['url']
  except Exception as e:
    print(f'Error getting presigned URL from API: {e}')

  # Send image to S3 via presigned URL
  try:
    response = requests.put(upload_url, data=image)
  except Exception as e:
    print(f'Error sending image to S3 with presigned URL: {e}')


def get_image_url(image_key, api_ip='localhost', api_port=3000):
  # Validate API URL
  base_url = f'http://{api_ip}:{str(api_port)}/api'
  response = requests.get(base_url)
  if response.status_code != 200:
    raise ConnectionError('Invalid API URL. Please double check api_ip and api_port.')

  # Get presigned URL from API
  try:
    endpoint = f'/download/{image_key}'
    response = requests.get(base_url + endpoint)
    download_url = json.loads(response.content)['url']
  except Exception as e:
    print(f'Error getting presigned URL from API: {e}')

  return download_url