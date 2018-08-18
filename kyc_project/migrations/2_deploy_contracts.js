var Address = artifacts.require("./libraries/Address.sol");
var Ownable = artifacts.require("./Ownable.sol");
var CustomerKYC = artifacts.require("./CustomerKYC.sol");

module.exports = function(deployer) {
  deployer.deploy(Address);
  deployer.deploy(Ownable);
  deployer.link(Address, CustomerKYC);
  deployer.link(Ownable, CustomerKYC);
  deployer.deploy(CustomerKYC);
};
