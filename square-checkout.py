import json
from square.client import Client
import requests
import webbrowser
import os

def lambda_handler(event,context):
    
    
    method = event['requestContext']['http']['method']
    
    client = Client(
        access_token = os.environ['SQUARE_ACCESS_TOKEN'],
        environment = 'production'
    )
    
  
    if method == "PUT":
        bodyContent = json.loads(event['body'])
        orderItems = bodyContent['line_items']
        
        x = {
            "description": os.environ['DESCRIPTION'],
            "order": {
            "location_id": os.environ['LOCATION_ID'],
            "line_items":orderItems
            },
            "checkout_options": {
             "allow_tipping": False,
            "merchant_support_email": os.environ["EMAIL"],
            "ask_for_shipping_address": True,
            "accepted_payment_methods": {
                "apple_pay": True,
                "google_pay": True,
                "cash_app_pay": True,
                "afterpay_clearpay": True
            },
            "enable_coupon": False,
            "enable_loyalty": False
            }
        }
    
    
        result = client.checkout.create_payment_link(
            body = json.dumps(x)
        )
    
        if result.is_success():
            url = result.body['payment_link']['url']
            return {
                'statusCode': 200,
                'body': url 
            }
       
        elif result.is_error():
            return {
                'statusCode': 400,
                'body': json.dumps('Request failed')
            }

    if method == "GET": 

        result = client.catalog.list_catalog(
            types = "ITEM"
        )
        
        items = result.body['objects']
        imageNames = []
        image =''
  
        # # loops thorugh the objects
        for i in range(len(items)):
            # grabs the image ids
            image = result.body['objects'][i]['item_data']['image_ids']
            
            # gets the info of the image id
            result2 = client.catalog.batch_retrieve_catalog_objects(
              body = {
                "object_ids": image
              })
             
            
            # # for successful result loop through the 
            if result2.is_success():
                
                productPics = []
                for index in range(len(result2.body["objects"])):
                    productPics.append(result2.body["objects"][index]['image_data']['name'])
                    
            print(productPics)
            result.body['objects'][i]['item_data']['image_ids'] = productPics
        
        
        if result.is_success():
            return {
                'statusCode': 200,
                'body':
                    {
                        "items":json.dumps(items)
                    }
                
            }
   
        elif result.is_error():
            return {
                'statusCode': 400,
                'body': json.dumps('Request failed')
            }
    
