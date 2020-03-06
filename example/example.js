const smsorange = require('../lib/');

// Your Access Token
let SMS = new smsorange("<Your Authorization header>");

// Your Number Type : prefix + number (+22501020304)
SMS.sendSms("Your number", "Your message")
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
SMS.getBalence().then(res => {
  console.log(res)
})
.catch(err =>{
  console.log(err)
})
SMS.getStatistics()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
//numberOfReceiver Type : prefix + number (+22505060708)
