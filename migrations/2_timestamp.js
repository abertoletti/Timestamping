var Timestamp = artifacts.require("./Timestamp.sol");

module.exports = function(deployer) {
    deployer.deploy(Timestamp);
  };