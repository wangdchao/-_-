

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
				ree.innerHTML="更新成功";
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
			ree.innerHTML="失败";
			ree.style.color="red";
		}
		else {
			var SelectL1=document.getElementById("select1");
			for(var i=0;i<AccountList.length;i++) {
				if(i==0) {
					presentAccount=AccountList[i];
				}
				else if(i==1) {
					document.getElementById("main1").innerHTML=String(AccountList[i]);
				}
				else {
					var newop1=document.createElement("option");
					newop1.innerHTML=String(AccountList[i]);
					newop1.value=i-1;
					SelectL1.appendChild(newop1);
				}
			}
			var ree=document.getElementById("result2");
			ree.innerHTML="获取成功";
			ree.style.color="green";
		}
	})
}

//授权
function giveRight(pAcc,acc) {
	$.post("http://localhost:8081/giveright/",{pAcc,acc},function(res){
		if(typeof res.state != undefined) {
			if(res.state==200) {
				alert("授权成功");
			}
			else alert("授权失败,查看服务器输出");
		}
		else alert("授权失败,查看服务器输出");
	})
}
//跳转到Index界面
function jumpIndex() {
	$.get("http://localhost:8081/indexhtml",function(res){
		if(res) {
			document.write(res);
			document.close();
		}
	});
}
//结束物品交易
function makeTransaction(acc) {
	$.post("http://localhost:8081/maketransaction",{acc},function(res){
		if(typeof res.state!=undefined) {
			if(res.state==200) {
				alert("已确认交易完成");
			}
			else alert("确认交易失败,查看服务器输出");
		}
		else {
			alert("确认交易失败,查看服务器输出");
		}
	})
}
//开启发起拍卖的权限
function openRight(acc) {
	$.post("http://localhost:8081/openright",{acc},function(res){
		if(typeof res.state!=undefined) {
			if(res.state==200) {
				alert("权限已开启");
			}
			else {
				alert("权限开启失败,查看服务器输出");
			}
		}
		else {
			alert("权限开启失败,查看服务器输出");
		}
	})
}
//关闭发起拍卖的权限
function closeRight(acc) {
	$.post("http://localhost:8081/closeright",{acc},function(res){
		if(typeof res.state!=undefined) {
			if(res.state==200) {
				alert("权限已关闭");
			}
			else {
				alert("权限关闭失败,查看服务器输出");
			}
		}
		else {
			alert("权限关闭失败,查看服务器输出");
		}
	})
}
//剥夺授权
function takeRight(pAcc,acc) {
	$.post("http://localhost:8081/takeright/",{pAcc,acc},function(res){
		if(typeof res.state != undefined) {
			if(res.state==200) {
				alert("剥夺权限成功");
			}
			else alert("剥夺权限失败,查看服务器输出");
		}
		else alert("剥夺权限失败,查看服务器输出");
	})
} 


var presentAccount;
window.addEventListener("load",function(){
	getAccountList();
	updateInfo();
	//更新表格信息
	document.getElementById("infoButton").addEventListener("click",updateInfo);
	//授权
	document.getElementById("giveRight").addEventListener("click",function(){
		var index=document.getElementById("select1").selectedIndex;
		var acc=document.getElementById("select1").options[index].text;
		giveRight(presentAccount,acc);
	});
	//跳转到Index界面
	document.getElementById("jumpIndex").addEventListener('click',jumpIndex);
	//结束物品交易
	document.getElementById("makeTransaction").addEventListener("click",function(){
		makeTransaction(presentAccount);
		updateInfo();
	})
	//开启发起拍卖的权限
	document.getElementById("open").addEventListener("click",function(){
		openRight(presentAccount);
	})
	//关闭发起拍卖的权限
	document.getElementById("close").addEventListener("click",function(){
		closeRight(presentAccount);
	})
	//剥夺授权
	document.getElementById("takeRight").addEventListener('click',function(){
		var index=document.getElementById("select1").selectedIndex;
		var acc=document.getElementById("select1").options[index].text;
		takeRight(presentAccount,acc);
	})
})