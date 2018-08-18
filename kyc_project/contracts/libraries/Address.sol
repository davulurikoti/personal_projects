pragma solidity ^0.4.17;

library Address {
  // We define a new struct datatype that will be used to
  // hold its data in the calling contract.
  struct Data { mapping(address=> bool) flags; }

  function insert(Data storage self, address value) public
      returns (bool)
  {
      if (self.flags[value])
          return false;
      self.flags[value] = true;
      return true;
  }

  function remove(Data storage self, address value) public
      returns (bool)
  {
      if (!self.flags[value])
          return false; // not there
      self.flags[value] = false;
      return true;
  }

  function contains(Data storage self, address value) internal view
      returns (bool)
  {
      return self.flags[value];
  }
}
