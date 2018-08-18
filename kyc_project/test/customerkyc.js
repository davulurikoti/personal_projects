var CustomerKYC = artifacts.require("./CustomerKYC.sol");

contract('CustomerKYC', function(accounts) {
  it("checks whether first KYC Account is main owner", function() {
    return CustomerKYC.deployed().then(function(instance) {
      return instance.getOwner();
    }).then(function(owner) {
      assert.equal(owner, accounts[0]);
    });
  });

  it("verifies adding and deleting the second account as an employee", function() {
    var contract_inst;
    return CustomerKYC.deployed().then(function(instance) {
      contract_inst = instance;
      contract_inst.addKYCEmployee(accounts[1]);
      return contract_inst.employeeStatus(accounts[1]);
    }).then(function(response) {
      assert.equal(response, true);
      contract_inst.removeKYCEmployee(accounts[1]);
      return contract_inst.employeeStatus(accounts[1]);
    }).then(function(resp) {
      assert.equal(resp, false);
    });
  });

  it('submits second account for KYC verification', function() {
    var contract_inst;
    var addr_status;
    return CustomerKYC.deployed().then(function(instance) {
      contract_inst = instance;
      contract_inst.submitKYCAccount(accounts[1]);
      return contract_inst.getAddressStatus(accounts[1]);
    }).then(function(status) {
      addr_status = status;
      return contract_inst.getSubmittedKYCStatus();
    }).then(function(submitStatus) {
      assert.equal(addr_status.toJSON(), submitStatus.toJSON());
    });
  });

  it('starts processing second account for KYC verification', function() {
    var contract_inst;
    var addr_status;
    return CustomerKYC.deployed().then(function(instance) {
      contract_inst = instance;
      contract_inst.submitKYCAccount(accounts[1]);
      contract_inst.startProcessingKYCAccount(accounts[1]);
      return contract_inst.getAddressStatus(accounts[1]);
    }).then(function(status) {
      addr_status = status;
      return contract_inst.getProcessingKYCStatus();
    }).then(function(processingStatus) {
      assert.equal(addr_status.toJSON(), processingStatus.toJSON());
    });
  });

  it('verifies second account for KYC verification', function() {
    var contract_inst;
    var addr_status;
    return CustomerKYC.deployed().then(function(instance) {
      contract_inst = instance;
      contract_inst.submitKYCAccount(accounts[1]);
      contract_inst.startProcessingKYCAccount(accounts[1]);
      contract_inst.verifyKYCAccount(accounts[1]);
      return contract_inst.getAddressStatus(accounts[1]);
    }).then(function(status) {
      addr_status = status;
      return contract_inst.getVerifiedKYCStatus();
    }).then(function(verifiedStatus) {
      assert.equal(addr_status.toJSON(), verifiedStatus.toJSON());
    });
  });

  it('rejects second account for KYC verification', function() {
    var contract_inst;
    var addr_status;
    return CustomerKYC.deployed().then(function(instance) {
      contract_inst = instance;
      contract_inst.submitKYCAccount(accounts[1]);
      contract_inst.startProcessingKYCAccount(accounts[1]);
      contract_inst.rejectKYCAccount(accounts[1]);
      return contract_inst.getAddressStatus(accounts[1]);
    }).then(function(status) {
      addr_status = status;
      return contract_inst.getRejectedKYCStatus();
    }).then(function(rejectedStatus) {
      assert.equal(addr_status.toJSON(), rejectedStatus.toJSON());
    });
  });
});
