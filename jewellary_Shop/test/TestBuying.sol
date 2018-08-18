pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Buying.sol";


contract TestBuying {
    Buying buying = Buying(DeployedAddresses.Buying());
    
    
    function testUserCanBuyItem() public {
        uint returnedId = buying.buy(8);
        uint expected = 8;

        Assert.equal(returnedId, expected, "Buying of Item ID 8 should be recorded.");
    }
    
    
    function testGetBuyerAddressByItemId() public {
    // Expected owner is this contract
        address expected = this;
        address buyer = buying.buyers(8);

        Assert.equal(buyer, expected, "Owner of Item ID 8 should be recorded.");
    }

    
    function testGetBuyerAddressByItemIdInArray() public {
    // Expected owner is this contract
        address expected = this;
    // Store buyers in memory rather than contract's storage
        address[16] memory buyers = buying.getBuyers();

        Assert.equal(buyers[8], expected, "Owner of Item ID 8 should be recorded.");
    }

}