import json
from square.client import Client
import requests
import webbrowser
import os
import square




def lambda_handler():
    
    # bodyContent = json.loads(event['body'])
    # orderItems = bodyContent['line_items']
    # listItems = []
    
    

    client = Client(
        access_token = os.environ['SQUARE_ACCESS_TOKEN'],
        environment = 'production'
    )

#     x = {
#         "description": os.environ['DESCRIPTION'],
#         "order": {
#         "location_id": os.environ['LOCATION_ID'],
#         "line_items":orderItems
#         },
#         "checkout_options": {
#          "allow_tipping": False,
#         "merchant_support_email": os.environ["EMAIL"],
#         "ask_for_shipping_address": True,
#         "accepted_payment_methods": {
#             "apple_pay": True,
#             "google_pay": True,
#             "cash_app_pay": True,
#             "afterpay_clearpay": True
#         },
#         "enable_coupon": False,
#         "enable_loyalty": False
#         }
# }


    result = client.catalog.list_catalog(
        types = "ITEM"

    )

    if result.is_success():
        print(result.body)
    elif result.is_error():
        print(result.errors)
   
    # elif result.is_error():
    #     # return {
    #     #     'statusCode': 400,
    #     #     'body': json.dumps('Request failed')
    #     # }


# client = Client(
#         access_token= os.environ['SQUARE_ACCESS_TOKEN'],
#         environment = 'production'
#     )

# # x = {
# #     "types": 
# # }


# result = client.catalog.list_catalog(
#         types = "category"
#     )

# if result.is_success():
    
#     return {
#         'statusCode': 200,
#         'body': result.body 
#     }
# elif result.is_error():
#     return {
#         'statusCode': 400,
#         'body': json.dumps('Request failed')
#     }

lambda_handler()