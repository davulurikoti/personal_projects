var Ownable = artifacts.require("./Ownable.sol");

contract('Ownable', function(accounts) {
  it("set owner to first account", function() {
    return Ownable.deployed().then(function(instance) {
      return instance.getOwner();
    }).then(function(owner) {
      assert.equal(owner, accounts[0]);
    });
  });

  it('should transfer ownership to second account', function() {
    return Ownable.deployed().then(function(instance) {
      instance.transferOwnership(accounts[1]);
      return instance.getOwner();
    }).then(function(owner) {
      assert.equal(owner, accounts[1]);
    });
  });
});
