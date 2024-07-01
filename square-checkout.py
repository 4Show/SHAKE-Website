import json
from square.client import Client
import requests
import webbrowser
import os

def lambda_handler(event,context):
    
    bodyContent = json.loads(event['body'])
    orderItems = bodyContent['line_items']
    listItems = []
    
    

    client = Client(
        access_token = os.environ['SQUARE_ACCESS_TOKEN'],
        environment = 'production'
    )

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


