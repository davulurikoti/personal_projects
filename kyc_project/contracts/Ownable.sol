pragma solidity ^0.4.17;

contract Ownable {
    address public owner;


    event OwnershipTransferred(address previousOwner, address newOwner);
    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function getOwner() public view returns (address) {
      return owner;
    }

}
