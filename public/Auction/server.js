var express = require("express");  
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//var web3 = require("./getWeb3");
var Web3 = require("web3")
var web3 = new Web3()
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"))


app.get("/",function(req,res){
    console.log()
    res.sendFile(__dirname + "/public/right.html");
})


fs.readFile('./build/contracts/Auction.json', 'utf-8', function (err, data) {
	if (err) {
		console.log("合约获取失败");
	} else {
        //获取合约对象实例
        var abi = JSON.parse(data)["abi"]
		var address = JSON.parse(data).networks
		var tl = Object.keys(address).length-1
        address = address[Object.keys(address)[tl]].address
        
        /**判断是否成功获取了合约对象的实例*/
        Instance = web3.eth.contract(abi).at(address)
        if(typeof Instance == undefined) console.log("fail get instance")
        

        /*授权*/
        app.post('/giveright',function(req,res){
            var addrF=req.body.pAcc;
            var addrT=req.body.acc;
            Instance.giveRightToAuctor.sendTransaction(addrT,{from:addrF,gas:300000},function(err,result){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200})
                }
            })
        })

        /**上传出价 */
        app.post("/putvalue", function(req, res){
            var price = req.body.price;
            var addr = req.body.addr;
            console.log(addr+"出价"+price);
            Instance.putValue.sendTransaction(price,{from:addr,gas:300000},function(error,result){
                if(error) {
                    console.log("出价异常");
                    res.send({state:404});
                }
                else {
                    res.send({state:200});
                }
            });
        })

        /**上传拍卖物品的信息 */
        app.post("/uploadthinginfo",function(req,res){
            var Name=req.body.thingName;
            var Value=req.body.baseValue;
            var Des=req.body.des;
            var Acc=req.body.acc;
            console.log(Acc+"想要拍卖"+Name);
            Instance.askCreateAuction.sendTransaction(Name,Value,Des,{from:Acc,gas:3000000},function(err,resu){
                if(err) {
                    res.send({state:400})
                    console.log(err)
                }
                else {
                    res.send({state:200})
                }
            })
        })
        
        /**更新拍卖物品的信息*/
        app.get("/tableInfo",function(req,res){
            console.log("ask update table info")
            Instance.getThingInfo.call(function(err,resu){
                if(err) {
                    console.log("Err when get thing info");
                    res.send({state:400})
                }
                else {
                    res.send({state:200,Name:resu[0],AccountOwner:resu[2],Value:resu[1].c[0],AccountPut:resu[3],pstate:resu[4]})
                }
            })
        })

        /**结束物品交易 */
        app.post("/maketransaction",function(req,res){
            console.log("ask make the transaction")
            var addr=req.body.acc
            Instance.makeTheTransaction.sendTransaction({from:addr,gas:300000},function(err,resu){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200})
                }
            })
        })
        /**开启发起权限 */
        app.post("/openright",function(req,res){
            console.log("ask open the right")
            var addr=req.body.acc
            Instance.openRight.sendTransaction({from:addr,gas:300000},function(err,resu){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200})
                }
            })
        })

        /**关闭发起权限 */
        app.post("/closeright",function(req,res){
            console.log("ask close the right")
            var addr=req.body.acc
            Instance.closeRight.sendTransaction({from:addr,gas:300000},function(err,resu){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200})
                }
            })
        })
        /**剥夺某人的权限 */
        app.post("/takeright",function(req,res){
            var addrF=req.body.pAcc;
            var addrT=req.body.acc;
            Instance.takeRightToAuctor.sendTransaction(addrT,{from:addrF,gas:300000},function(err,result){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200})
                }
            })
        })

        /**推迟某人的拍卖 */
        app.post("/delaytransaction",function(req,res){
            var addr=req.body.acc
            Instance.delayAuction.sendTransaction({from:addr,gas:300000},function(err,resu){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200})
                }
            })
        })
        /**获得某人当前的拍卖物品*/
        app.post("/getowner",function(req,res){
            var addr=req.body.acc
            Instance.getNowOwnAuction.call({from:addr},function(err,resu){
                if(err) {
                    console.log(err)
                    res.send({state:400})
                }
                else {
                    res.send({state:200,Name:resu[0],Value:resu[1].c[0],pstate:resu[2]})
                }         
            })
        })

    }
})

app.get("/indexhtml",function(req,res){
    console.log("indexhtml");
    res.sendFile(__dirname + "/public/bootstrap/index.html");
})



//获取所有用户
app.get('/accountInfo',function(req,res){
    web3.eth.getAccounts(function(error, result){
        if(!error) res.send(result)
    })
})


app.listen(8081,function(){
    console.log('server start and listen on port 8081')
});