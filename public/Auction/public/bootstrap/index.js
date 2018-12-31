//判断当前选中账户是否为负责人账户
function isTheChairman() {
	var index=document.getElementById("select").selectedIndex;
	var va=document.getElementById("select").options[index].value;
	presentAccount = document.getElementById("select").options[index].text;
	if(va==0) return true;
	else return false;
}

//判断输入的价格是否合法
function isValidPrice() {
	var value=document.getElementById("name").value;
	var pat2=/^[1-9]/;
	if(pat2.test(value)==false&&value!="") {
		return false;
	}
	try{
		parseInt(value);
	}catch(err) {
		return false;
	}
	return true;
}

//更新物品信息
function updateInfo() {
	$.get('http://localhost:8081/tableInfo',function(tableInfo){
		if(typeof tableInfo == undefined) {
			var ree=document.getElementById("result1");
			ree.innerHTML="更新失败,查看服务器输出";
			ree.style.color="red";
		}
		else {
			if(tableInfo.state==200) {
				document.getElementById("thingName").innerHTML=tableInfo.Name;
				document.getElementById("ownerAccount").innerHTML=tableInfo.AccountOwner;
				document.getElementById("presentValue").innerHTML=String(tableInfo.Value)
				document.getElementById("putAccount").innerHTML=tableInfo.AccountPut;
				if(tableInfo.pstate==false) document.getElementById("pStatus").innerHTML="进行";
				else  document.getElementById("pStatus").innerHTML="结束";
				var ree=document.getElementById("result1");				
				document.getElementById("result1").innerHTML="更新成功";
				ree.style.color="green";
			}
			else {
				var ree=document.getElementById("result1");
				ree.innerHTML="更新失败,查看服务器输出";
				ree.style.color="red";
			}
		}
    })
}
//获取账户列表
function getAccountList(){
	$.get('http://localhost:8081/accountInfo',function(AccountList){
		if(typeof AccountList == undefined) {
			var ree=document.getElementById("result2");
			ree.innerHTML="获取账户列表失败,查看服务器输出";
			ree.style.color="red";
		}
		else {
			var SelectL=document.getElementById("select");
			for(var i=0;i<AccountList.length;i++) {
				if(i==0) {
					document.getElementById("main").innerHTML=String(AccountList[i]);
				}
				else if(i==1) {
					document.getElementById("second").innerHTML=String(AccountList[i]);
				}
				else {
					var newop=document.createElement("option");
					newop.innerHTML=String(AccountList[i]);
					newop.value=i;
					SelectL.appendChild(newop);
				}
			}
			var ree=document.getElementById("result2");
			ree.innerHTML="获取账户成功";
			ree.style.color="green";
		}
	})
}

//上传出价
function upLoadValue(price,addr) {
	$.post("http://localhost:8081/putvalue/",{price,addr},function(res){
		if(typeof res.state != undefined) {
			if(res.state==200) {
				alert("出价成功");
			}
			else alert("出价失败,查看服务器输出");
		}
		else alert("出价失败,查看服务器输出");
	})
} 


//上传发起竞拍物品信息
function upLoadThingInfo(thingName,baseValue,des,acc) {
	$.post("http://localhost:8081/uploadthinginfo/",{thingName,baseValue,des,acc},function(res){
		if(typeof res.state != undefined) {
			if(res.state==200) alert("上传成功");
			else {
				alert("上传失败,查看服务器输出");
			}
		}
		else alert("上传失败,查看服务器输出");
	})
}

//跳转授权区
function jumpRight(){
	$.get("http://localhost:8081/",function(res){
		if(res) {
			document.write(res);
			document.close();
		}

	});
}
//取消拍卖
function delayAuction(acc){
	$.post("http://localhost:8081/delaytransaction",{acc},function(res){
		if(typeof res.state!=undefined) {
			if(res.state==200) {
				alert("取消成功");
			}
			else {
				alert("取消失败,查看服务器输出");
			}
		}
		else {
			alert("取消失败,查看服务器输出");
		}
	})
}
//获得自己拍卖
function getOwn(acc){
	$.post("http://localhost:8081/getowner",{acc},function(res){
		if(typeof res.state!=undefined) {
			if(res.state==200) {
				document.getElementById("thingName1").innerHTML=res.Name;
				document.getElementById("presentValue1").innerHTML=String(res.Value);
				if(res.pstate==false) document.getElementById("state1").innerHTML="进行";
				else document.getElementById("state1").innerHTML="结束";
				var ree=document.getElementById("result3");
				ree.innerHTML="更新成功";
				ree.style.color="green";
			}
			else {
				var ree=document.getElementById("result3");
				ree.innerHTML="更新失败,查看服务器输出";
				ree.style.color="red";
			}
		}
		else {
			var ree=document.getElementById("result3");
			ree.innerHTML="更新失败,查看服务器输出";
			ree.style.color="red";
		}
	})
}

var presentAccount;
//window刷新监听器
window.addEventListener("load",function(){
	var out = Math.floor(Math.random()*10000);
	var indentity=new String(out);
	document.getElementById("iden").innerHTML=indentity;
	getAccountList();
	updateInfo();
	

	//检测并跳转
	document.getElementById("select").addEventListener("change",function(){
		if(isTheChairman()) jumpRight();
		else {
			getOwn(presentAccount);
		}
	});

	//实时判断价格输入合法性
	document.getElementById("name").addEventListener("change",function(){
		if(isValidPrice()) {
			document.getElementById("errN").innerHTML="";
		}
		else {
			document.getElementById("errN").innerHTML="Error:wrong input";
		}
	});

	//上传价格
	document.getElementById("loginButton").addEventListener("click",function(){
		if(isValidPrice()) {
			var price=parseInt(document.getElementById("name").value);
			var iden=document.getElementById("password").value;
			if(iden==indentity) {
				document.getElementById("errP").innerHTML="";
				out = Math.floor(Math.random()*10000);
				indentity=new String(out);
				document.getElementById("iden").innerHTML=indentity;
				upLoadValue(price,presentAccount);
				updateInfo();
			}
			else {
				document.getElementById("errP").innerHTML="Error:wrong input";
			}
		}
	});
	
	//发起并上传新的拍卖物品的信息
	document.getElementById("upButton").addEventListener("click",function(){
		var Name=document.getElementById("name1").value;
		var Price=document.getElementById("password1").value;
		var Descr=document.getElementById("description").value;
		upLoadThingInfo(Name,parseInt(Price),Descr,presentAccount);
		updateInfo();
		getOwn(presentAccount);
	});

	//更新拍卖物品表的信息
	document.getElementById("infoButton").addEventListener("click",updateInfo);
	
	//取消拍卖某物品
	document.getElementById("delayButton").addEventListener('click',function(){
		delayAuction(presentAccount);
		getOwn(presentAccount);
	})
	
	//获取自己的拍卖
	document.getElementById("oinfoButton").addEventListener('click',function(){
		getOwn(presentAccount);
	})
});