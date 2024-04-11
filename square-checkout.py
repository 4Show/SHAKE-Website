from square.client import Client
import requests
import webbrowser
import pyscript
from fastapi import FastAPI

createPaymentLink()
def createPaymentLink():
    client = Client(
        access_token = 'EAAAFBT_k2zBJK0mLuu2hqIeVb4Rj8VqoKfZoatED1hZlFcIW82-qgRtp7o8-ZIs',
        # access_token='Bearer EAAAFBT_k2zBJK0mLuu2hqIeVb4Rj8VqoKfZoatED1hZlFcIW82-qgRtp7o8-ZIs',
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
        goToCheckOutPage(url)  # Go to example.com
    elif result.is_error():
        print(result.errors)



def goToCheckOutPage(url):
    webbrowser.open(url)  # Go to example.com
