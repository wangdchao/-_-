pragma solidity ^0.4.17;
contract Auction{
    struct AuctThing{
		//物品名
        string nameThing;
		//物品描述
        string describion;
		//该物品的最新最高价
        uint latestVaule;
		//该物品给现在最高价的出价人
        address latestAuctor;
		//该交易是否完成
        bool hasFinished;
		//改拍卖物品的所有人
        address owner;
    }
    uint256 public NUMBER;

	//拍卖系统新建拍卖物品权限是否开启
    uint256 private giveRigth;

    //拍卖系统负责人
    address public chairMan;

	//能够发起拍卖的人员的列表
    mapping(address => bool) private canPutAuction;

	//记录所有参与拍卖物品（包括已经拍卖结束正在或将要拍卖的物品）
    AuctThing[] private allThing;

	//账户地址与其所发起的拍卖物品的映射
    mapping(address => AuctThing) private TofA;

    //事件
    //event Instructor(address name,uint age);

    //构造函数
    constructor() public{
        chairMan = msg.sender;
        NUMBER = 0;
    } 

	//开放发起新拍卖的权限
    function openRight() public {
        require(msg.sender==chairMan,"Only the chairman can open the right");
        giveRigth = 1;
    }

	//关闭发起新拍卖的权限
    function closeRight() public {
        require(msg.sender==chairMan,"Only the chairman can close the right");
        giveRigth = 0;
    }

	//对指定用户由chairman给与可以发起新交易的权限
    function giveRightToAuctor(address newPerson) public {
        require(msg.sender==chairMan,"Only the chairman has the right to call the function");
        require(newPerson != chairMan,	"Sorry, Chairman can not");
        require(canPutAuction[newPerson]!=true,"The person has got the right");
        //emit Instructor(newPerson,1);
        canPutAuction[newPerson] = true;
    }

    //对指定用户取消他的权限
    function takeRightToAuctor(address newPerson) public {
        require(msg.sender==chairMan,"Only the chairman has the right to call the function");
        require(newPerson != chairMan,	"Sorry, Chairman can not");
        require(canPutAuction[newPerson]==true,"The person has got the right");
        //emit Instructor(newPerson,2);
        canPutAuction[newPerson] = false;
    }

	//发起新的拍卖交易
    function askCreateAuction(string memory name,uint value,string memory des) public{
        require(msg.sender != chairMan,"Sorry,the chairman can not put forward a Auction");
        require(canPutAuction[msg.sender] == true,"Soryy, you have not the right to put forward a auction");
        createAuction(name,value,des,msg.sender);
    }

	//私有函数，由chairman进行调用
    function createAuction(string memory name,uint value,string memory des,address caller) private{
        require(giveRigth == 1,"The right has been closed");
        bool notExisted = true;
        AuctThing memory newAuction;
        newAuction.nameThing = name;
        newAuction.latestVaule = value;
        newAuction.latestAuctor = caller;
        newAuction.hasFinished = false;
        newAuction.describion = des;
        newAuction.owner = caller;
        for(uint i = 0;i < allThing.length;i++) {
            if(newAuction.owner == allThing[i].owner && allThing[i].hasFinished==false) {
                notExisted = false;
            }
        }
        require(notExisted,"Sorry, there has been a auction for you");
        allThing.push(newAuction);
        UpdateNumber();
        TofA[caller].nameThing = newAuction.nameThing;
        TofA[caller].hasFinished = newAuction.hasFinished;
        TofA[caller].owner = newAuction.owner;
        TofA[caller].latestVaule = newAuction.latestVaule;
        TofA[caller].latestAuctor = newAuction.latestAuctor;
        TofA[caller].describion = newAuction.describion;
    }

	//得到当前拍卖的物品信息
    function getThingInfo() public view returns(string memory , uint, address,string memory,bool) {
        if(NUMBER == 0 && allThing.length == 0) {
            return ("NULL",0,address(0),"NULL",true);
        }
        return (allThing[uint(NUMBER)].nameThing,allThing[uint(NUMBER)].latestVaule,allThing[uint(NUMBER)].owner,
        allThing[uint(NUMBER)].describion,allThing[uint(NUMBER)].hasFinished);
    }

	//跟新当前拍卖物品的号码
    function UpdateNumber() private {
        if(allThing.length-1>=0) NUMBER = allThing.length-1;
        else NUMBER = 0;
        for(uint i = 0;i < allThing.length;i++) {
            if(allThing[i].hasFinished==false) {
                NUMBER = i;
                break;
            }
        }
    }

	//出价
    function putValue(uint value) public{
        require(allThing.length!=0,"There is not anything is being aucted");
        require(allThing[uint(NUMBER)].hasFinished==false,"The present auction is over and the next does not start");
        require(value > allThing[uint(NUMBER)].latestVaule,"There has been a higher price,your should put a higher price");
        require(msg.sender.balance > value,"You left ether not enough"); 

        allThing[uint(NUMBER)].latestVaule = value;
        allThing[uint(NUMBER)].latestAuctor = msg.sender;
        TofA[allThing[uint(NUMBER)].owner].latestAuctor = msg.sender;
        TofA[allThing[uint(NUMBER)].owner].latestVaule = value;
    }

	//拍卖成交
    function makeTheTransaction() public {
        require(msg.sender==chairMan,"Only the chairman has access to make the auction over");
        require(allThing.length != 0,"There is not any auction");
        require(allThing[uint(NUMBER)].hasFinished==false,"The present auction has finished,waiting for the next starting");
        allThing[uint(NUMBER)].hasFinished = true;
        TofA[allThing[uint(NUMBER)].owner].hasFinished = true;
        UpdateNumber();
    }

	//取消原有的拍卖
    function delayAuction() public{
        require(msg.sender!=chairMan,"Sorry, the chairman can not delay the auction");
        bool canDelay = false;
        uint d = 0;
        for(uint i = 0;i < allThing.length;i++) {
            if(allThing[i].owner==msg.sender&&allThing[i].hasFinished==false) {
                canDelay = true;
                d = i;
            }
        }
        require(canDelay,"No one to delay or the auction has finished");
        allThing[d].hasFinished = true;
        TofA[msg.sender].hasFinished = true;
        UpdateNumber();
    }

	//获得当前自己所发起的交易
    function getNowOwnAuction() public view returns(string memory,uint,bool) {
        if(TofA[msg.sender].owner!=msg.sender) return ("",0,true);
        else return (TofA[msg.sender].nameThing,TofA[msg.sender].latestVaule,TofA[msg.sender].hasFinished);
    }

}