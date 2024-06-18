import json
from square.client import Client
import requests
import webbrowser
import os

def lambda_handler(event,context):


    client = Client(
        access_token = os.environ['SQUARE_ACCESS_TOKEN'],
        environment = 'production'
    )

    result = client.checkout.create_payment_link(
    body = {
        "description": "SHK Apparel",
        "order": {
        "location_id": "L96PW6T2031NW",
        "line_items": [
            {
            "quantity": "1",
            "catalog_object_id": "YE5IZG3MRWPGUTU6AAHJJOLR",
            "item_type": "ITEM"
            },
            {
            "quantity": "1",
            "catalog_object_id": "XPW67JJWOQUJT63ANITAESSV",
            "item_type": "ITEM"
            },
            {
            "quantity": "1",
            "catalog_object_id": "XPW67JJWOQUJT63ANITAESSV",
            "item_type": "ITEM"
            }
        ]
        },
        "checkout_options": {
        "allow_tipping": False,
        "merchant_support_email": "4showinvestments@gmail.com",
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
    )

    if result.is_success():
        url = result.body['payment_link']['url']
        return {
        'statusCode': 200,
        'body': json.dumps({
                'message': url 
            })
        }
        goToCheckOutPage(url)  # Go to example.com
    elif result.is_error():
        return {
            'statusCode': 400,
            'body': json.dumps('Request failed')
        }

def goToCheckOutPage(url):
    webbrowser.open(url)  # Go to example.com


import requests

response = requests.get("https://b44ax3y3wncvazueob7tlu53iu0jjscm.lambda-url.us-east-1.on.aws/")
print(response.text)