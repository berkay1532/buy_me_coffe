//SPDX-License-Identifier: Unlicense


//Deployed to goerli at 0x0Ea448856a3D341834CdFa13cC132eaC15A8b445
pragma solidity ^0.8.0;

contract BuyMeACoffe {

    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string messsage
    );


    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of memos
    Memo[] memos;

    //Address of contract deployer
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }


    function buyCoffee(string memory _name,string memory _message) public payable{
        require(msg.value > 0,"You cant buy a coffe with 0 ETH");
 
        memos.push(
            Memo(
                msg.sender,
                block.timestamp,
                _name,
                _message
            )
        );

        emit newMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }



    //Sending the money that coming from donaters and stored in this contract to owner
    function withdrawTips() public {
        require(owner.send(address(this).balance));

    }

    // Returns the memos of contract
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }





}