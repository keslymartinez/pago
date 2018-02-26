// llamando api mercadeo de pago
const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
	'mode':'sandbox',
	'client_id':'ATnpDJyyu577nn8SD1EYNBBpls04aNfu3dexS1f3D_zJINJEoNl0d7y93EZCBV_tabcENSpQ1r6M0738',
	'client_secret':'EPS3P2MeoKN1BhWK-gM_phBGcKH-R5ZqLUjacDNTkRSXhYNfNu1romTZzXeOXQQqeIQ7drIlL7ImN9EA'


});



const app = express();
app.set('view engine', 'ejs');
app.get('/',(req,res) => res.render('index'));
app.post('/pay', (req,res) => {
	const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Celular JS",
                "sku": "001",
                "price": "500.0000",
                "currency": "CLP",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "CLP",
            "total": "500.000"
        },
        "description": "Celular android"
    }]
};



paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});


});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "CLP",
            "total": "500.000"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
    }
});
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(3000, () => console.log('Server Started'));