const hre = require('hardhat');


async function getBalance(address){

    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
    
}

async function printBalances(adresses){

    let idx = 0;
    for(const address of adresses){
        console.log(`Address ${idx} balance: `,await getBalance(address));
        idx++;
    }
}

async function printMemos(memos){
    for(const memo of memos){
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperMessage = memo.message;
        const tipperAddress = memo.from;
        console.log(`At ${timestamp}, (${tipper})  ${tipperAddress} said: "${tipperMessage}" `);
    }

}

async function main(){
    //Get accounts
    const [owner,tipper1,tipper2,tipper3] = await hre.ethers.getSigners();

    //Get the contract deploy
    const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffe");
    const buyMeACoffe = await BuyMeACoffe.deploy();
    await buyMeACoffe.deployed();
    console.log("BuyMeACoffe deployed to ",buyMeACoffe.address);

    //Check balances before the coffe purchase
    const addresses = [owner.address,tipper1.address,buyMeACoffe.address];
    console.log("==start==");
    await printBalances(addresses);

    //Buy some coffees 
    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffe.connect(tipper1).buyCoffee("Jason","You nailed it!!",tip);//Third parameter is not exist but it is optional so we cna use it
    await buyMeACoffe.connect(tipper2).buyCoffee("Kevin","What a nice teacher huh!!",tip);
    await buyMeACoffe.connect(tipper3).buyCoffee("Meredith","Awesome tips!! Enjoy your coffe",tip);
    
    //Check balances after the coffe purchase
    console.log("==bought coffe==");
    await printBalances(addresses);

    //Withdraw funds
    await buyMeACoffe.connect(owner).withdrawTips();

    //Check balances after withdraw
    console.log("==bought coffe==");
    await printBalances(addresses);

    //Check memos
    console.log("==memos==");
    const memos = await buyMeACoffe.getMemos();
    printMemos(memos);






}

//Handling errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
