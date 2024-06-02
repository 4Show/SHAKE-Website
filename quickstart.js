// const { create } = require("domain");
// const fs = require("fs");


//import the SDK module CommonJS style
import { Client, Environment, ApiError } from "./node_modules/square";

//create a square client object with the appropriate environment and access token
// const client = new Client({
//     accessToken: process.env.SQUARE_ACCESS_TOKEN,
//     environment: Environment.Production,
// });
const client = new Client({
  bearerAuthCredentials: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN
  },
environment: Environment.Production,
});

//make API calls using the instance you want
const {checkoutApi, locationsApi } = client;




//createPaymentLink function for checkoutlink
async function createPaymentLink()
{
  let locResponse = getLocations();
  let location = JSON.stringify(locResponse);
  console.log(location); 
  var url;
  
    try {
        const response = await checkoutApi.createPaymentLink({
          description: 'SHK Apparel',
          order: {
            locationId: "L96PW6T2031NW",
            lineItems: [
              {
                quantity: '1',
                catalogObjectId: 'YE5IZG3MRWPGUTU6AAHJJOLR',
                itemType: 'ITEM'
              },
              {
                quantity: '1',
                catalogObjectId: 'XPW67JJWOQUJT63ANITAESSV',
                itemType: 'ITEM'
              },
              {
                quantity: '1',
                catalogObjectId: 'XPW67JJWOQUJT63ANITAESSV',
                itemType: 'ITEM'
              }
            ]
          },
          checkoutOptions: {
            allowTipping: false,
            merchantSupportEmail: '4showinvestments@gmail.com',
            askForShippingAddress: true,
            acceptedPaymentMethods: {
              applePay: true,
              googlePay: true,
              cashAppPay: true,
              afterpayClearpay: true
            },
            enableCoupon: false,
            enableLoyalty: false
          }
        });
        url = response.result.paymentLink.url;
        console.log(url);
        // return url;
        
      } catch(error) {
        console.log(error);
      }
      
      
}




async function getLocations() {
  try {
    let listLocationsResponse = await locationsApi.listLocations();

    let locations = listLocationsResponse.result.locations;

    locations.forEach(function (location) {
      console.log(
        location.id + ": " +
          location.name +", " +
          location.address.addressLine1 + ", " +
          location.address.locality
      );
      return location.id
    });
  } catch (error) {
    if (error instanceof ApiError) {
      error.result.errors.forEach(function (e) {
        console.log(e.category);
        console.log(e.code);
        console.log(e.detail);
      });
    } else {
      console.log("Unexpected error occurred: ", error);
    }
  }
};

// function URL()
// {
//   var url = createPaymentLink();
//   window.location.href = url;
// }

// URL();