const ContractCatalog = artifacts.require("SuperloudCatalog");

module.exports = function(deployer) {
  deployer.deploy(ContractCatalog);
};