pragma solidity ^0.4.17;

import "./Ownable.sol";
import "./libraries/Address.sol";


contract CustomerKYC is Ownable {
    enum KYCStatus {
        NOT_STARTED,
        SUBMITTED,
        PROCESSING,
        VERIFIED,
        REJECTED
     }

    event AddedKYCEmployee(address addr);

    event RemovedKYCEmployee(address addr);

    event SubmittedKYCAccount(address addr);

    event ProcessingKYCAccount(address addr, address indexed by);

    event RejectedKYCAccount(address addr, address indexed by);

    event VerifiedKYCAccount(address addr, address indexed by);

    mapping(address=>uint8) public addressStatus;
    Address.Data kycEmployees;

    function addKYCEmployee(address addr) public onlyOwner {
      if(!Address.insert(kycEmployees, addr)) {
        return;
      }

      emit AddedKYCEmployee(addr);
    }

    function removeKYCEmployee(address addr) public onlyOwner {
      if(!Address.remove(kycEmployees, addr)) {
        return;
      }

      emit RemovedKYCEmployee(addr);
    }

    function submitKYCAccount(address addr) public {
        addressStatus[addr] = uint8(KYCStatus.SUBMITTED);

        emit SubmittedKYCAccount(addr);
    }

    function startProcessingKYCAccount(address addr) public onlyOwnerOrPartner {
        uint8 status = addressStatus[addr];

        if(status != uint8(KYCStatus.SUBMITTED)) {
            return;
        }

        addressStatus[addr] = uint8(KYCStatus.PROCESSING);

        emit ProcessingKYCAccount(addr, msg.sender);
    }

    function rejectKYCAccount(address addr) public onlyOwnerOrPartner {
        uint8 status = addressStatus[addr];

        if(status != uint8(KYCStatus.PROCESSING)) {
            return;
        }

        addressStatus[addr] = uint8(KYCStatus.REJECTED);

        emit RejectedKYCAccount(addr, msg.sender);
    }

    function verifyKYCAccount(address addr) public onlyOwnerOrPartner {
        uint8 status = addressStatus[addr];

        if(status == uint8(KYCStatus.REJECTED)) {
            return;
        }

        if(status != uint8(KYCStatus.PROCESSING)) {
          return;
        }

        addressStatus[addr] = uint8(KYCStatus.VERIFIED);

        emit VerifiedKYCAccount(addr, msg.sender);
    }


    function getAddressStatus(address addr) public constant returns (uint8) {
        return uint8(addressStatus[addr]);
    }

    function getAddressStatusForDisplay(address addr) public constant returns (string) {
      uint8 status = uint8(addressStatus[addr]);
      if (status == uint8(KYCStatus.SUBMITTED)) {
        return "Submitted for Processing";
      } else if (status == uint8(KYCStatus.PROCESSING)) {
        return "Processing";
      } else if (status == uint8(KYCStatus.VERIFIED)) {
        return "Verified";
      } else if (status == uint8(KYCStatus.REJECTED)) {
        return "Rejected";
      } else {
        return "Not Started";
      }
    }

    function employeeStatus(address addr) public constant returns (bool) {
      return Address.contains(kycEmployees, addr);
    }

    function getSubmittedKYCStatus() public pure returns (uint8) {
      return uint8(KYCStatus.SUBMITTED);
    }

    function getProcessingKYCStatus() public pure returns (uint8) {
      return uint8(KYCStatus.PROCESSING);
    }

    function getVerifiedKYCStatus() public pure returns (uint8) {
      return uint8(KYCStatus.VERIFIED);
    }

    function getRejectedKYCStatus() public pure returns (uint8) {
      return uint8(KYCStatus.REJECTED);
    }

    modifier onlyOwnerOrPartner() {

        if(!(msg.sender == owner || Address.contains(kycEmployees, msg.sender))) {
		return;
        }

        _;
    }

}
