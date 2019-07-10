const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
const request = require('request')
const line = require('@line/bot-sdk');

const secret = "6fb3b10d28813836d2d1c43177e9fda0"
const token="/Kjgd90dOuoXNYT04u5CqSKyJmIH3E/5IMJt/GOQQS14EwUKBM2R55KMF4VW49etBtxiGWX2FPDqC0qf4AO2cYkPkSeueeHfO7VRKOsIOQXYhPqMf0aMVmK/8irgZV/6eu2nZHhQlZ8vtuUv3WHrggdB04t89/1O/w1cDnyilFU="
const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || token,
	channelSecret: process.env.CHANNEL_SECRET || secret
};
const client = new line.Client(config);  

const port = process.env.PORT ||4000;

const server = app.listen(port,()=>{
	console.log('Server is running on port '+port)
})

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
	res.render('index')
})

app.get('/api/v1/map',(req,res)=>{
	res.render('map')
})

app.get('/api/v1/rudy',(req,res)=>{
	res.json({
		name: "james",
		lastname: "bond", 
		age: 30,
		company: "Rudy Technology"
	})
})

app.get('/api/v1/findxyz',(req,res)=>{
	const query = req.query.q.toUpperCase()
	const txt = "3,5,9,15,X,Y,Z"
	const result = txt.indexOf(query)
	res.send({base_string:txt, query: query, result: result==-1?false:true, position: result})
})

app.post('/webhook', (req, res) =>{
	let reply_token = req.body.events[0].replyToken
	let msg = req.body.events[0].message.text
	reply(reply_token,msg)
	res.sendStatus(200)
})

function reply(reply_token,msg) {
	let sms = [{
				type: 'text',
				text: 'สวัสดีครับ'
			},
			{
				type: 'text',
				text: 'นี่คือข้อความจาก Rody-Bot'
			},
			{
				type: "sticker",
				packageId: 11537,
				stickerId: 52002735
			}];
	if(msg.indexOf("ข้อมูลบริษัท")>-1){
		sms=[{
				type: 'text',
				text: 'บริษัท Rudy Technology เป็นบริษัทในเครือ SCG '
			},
			{
				type: 'text',
				text: 'เราคือมืออาชีพในด้าน IT Solution บริการครบวงจรแบบ Non Stop Services เพื่อให้ลูกค้าพึงพอใจสูงสุด'
			},{
				type: "sticker",
				packageId: 11538,
				stickerId: 51626496
			}]
	}
	request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+token
		},
        body: JSON.stringify({
			replyToken: reply_token,
			messages: sms
		})
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
        console.log('reply_token = ' + reply_token);
    });
}

