// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import customerkyc_artifacts from '../../build/contracts/CustomerKYC.json'

var CustomerKYC = contract(customerkyc_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var employees;
var account;
var accountStatuses;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the CustomerKYC abstraction for Use.
    CustomerKYC.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      web3.eth.defaultAccount = account;

      accountStatuses = [];
      for (var i=0; i<accounts.length; i++) {
        var tempAccount = accounts[i];
        CustomerKYC.deployed().then(function(instance) {
          return instance.getAddressStatusForDisplay(tempAccount, {from: account});
        }).then(function(addressStatus) {
          accountStatuses.push(addressStatus);
          self.refreshAccountsList();
        }).catch(function(e) {
          console.log(e);
        });
      }

      employees = [];
      var kyc1;
      CustomerKYC.deployed().then(function(instance) {
        kyc1 = instance;
        return kyc1.addKYCEmployee(account, {from: account});
      }).then(function() {
        return kyc1.employeeStatus(account, {from: account});
      }).then(function(status) {
        if(status) {
          employees.push(account);
          self.refreshEmployeeList();
        }
      });
    });
  },

  addEmployee: function() {
    var address = document.getElementById("employee_address").value;
    var kyc;
    var self = this;
    if (employees.indexOf(address) < 0) {
      CustomerKYC.deployed().then(function(instance) {
        kyc = instance;
        return kyc.addKYCEmployee(address, {from: account});
      }).then(function() {
        return kyc.employeeStatus(address, {from: account});
      }).then(function(status) {
        if(status) {
          employees.push(address);
          self.refreshEmployeeList();
        }
      }).catch(function(e) {
        console.log(e);
      });
    }
  },

  submitAccount: function() {
    var address = document.getElementById("address2").value;
    var index = accounts.indexOf(address);
    var kyc;
    var self = this;
    CustomerKYC.deployed().then(function(instance) {
      kyc = instance;
      return kyc.submitKYCAccount(address, {from: account});
    }).then(function() {
      console.log('submitted');
      return kyc.getAddressStatusForDisplay(address, {from: account});
    }).then(function(status) {
      console.log(status);
      accountStatuses[index] = status;
      self.refreshAccountsList();
    }).catch(function(e) {
      console.log(e);
    });
  },

  startProcessingAccount: function() {
    var address = document.getElementById("address3").value;
    var index = accounts.indexOf(address);
    var kyc;
    var self = this;
    CustomerKYC.deployed().then(function(instance) {
      kyc = instance;
      return kyc.startProcessingKYCAccount(address, {from: account});
    }).then(function() {
      console.log('started processing');
      return kyc.getAddressStatusForDisplay(address, {from: account});
    }).then(function(status) {
      console.log(status);
      accountStatuses[index] = status;
      self.refreshAccountsList();
    }).catch(function(e) {
      console.log(e);
    });
  },

  verifyAccount: function() {
    var address = document.getElementById("address3").value;
    var index = accounts.indexOf(address);
    var kyc;
    var self = this;
    CustomerKYC.deployed().then(function(instance) {
      kyc = instance;
      return kyc.verifyKYCAccount(address, {from: account});
    }).then(function() {
      console.log('verified');
      return kyc.getAddressStatusForDisplay(address, {from: account});
    }).then(function(status) {
      console.log(status);
      accountStatuses[index] = status;
      self.refreshAccountsList();
    }).catch(function(e) {
      console.log(e);
    });
  },

  rejectAccount: function() {
    var address = document.getElementById("address4").value;
    var index = accounts.indexOf(address);
    var kyc;
    var self = this;
    CustomerKYC.deployed().then(function(instance) {
      kyc = instance;
      return kyc.rejectKYCAccount(address, {from: account});
    }).then(function() {
      console.log('rejected');
      return kyc.getAddressStatusForDisplay(address, {from: account});
    }).then(function(status) {
      console.log(status);
      accountStatuses[index] = status;
      self.refreshAccountsList();
    }).catch(function(e) {
      console.log(e);
    });
  },

  refreshAccountsList: function() {
    var accounts_list = document.getElementById("account_list");
    var message = "";
    for (var i=0; i<accounts.length; i++) {
      message += ((i+1)+". " + accounts[i] + " --- " + accountStatuses[i] + "<br/>");
    }
    accounts_list.innerHTML = message;
  },

  refreshEmployeeList: function() {
    var employees_list = document.getElementById("employee_list");
    var message = "";
    for (var i=0; i<employees.length; i++) {
      message += ((i+1)+". " + employees[i] + "<br/>");
    }
    employees_list.innerHTML = message;
  },
//
//   refreshBalance: function() {
//     var self = this;
//
//     var meta;
//     MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.getBalance.call(account, {from: account});
//     }).then(function(value) {
//       var balance_element = document.getElementById("balance");
//       balance_element.innerHTML = value.valueOf();
//     }).catch(function(e) {
//       console.log(e);
//       self.setStatus("Error getting balance; see log.");
//     });
//   },
//
//   sendCoin: function() {
//     var self = this;
//
//     var amount = parseInt(document.getElementById("amount").value);
//     var receiver = document.getElementById("receiver").value;
//
//     this.setStatus("Initiating transaction... (please wait)");
//
//     var meta;
//     MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.sendCoin(receiver, amount, {from: account});
//     }).then(function() {
//       self.setStatus("Transaction complete!");
//       self.refreshBalance();
//     }).catch(function(e) {
//       console.log(e);
//       self.setStatus("Error sending coin; see log.");
//     });
//   }
// };
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  }

  App.start();
});
