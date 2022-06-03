pragma solidity ^0.8.13;

contract SupplyChain {
    Item[] public supply;
    uint256 current_id = 0;

    enum Level{ MANUFACTURER, DISTRIBUTOR, RETAILER, CUSTOMER }

    struct Item {
        uint256 id;
        uint256 internal_id;
        string name;
        string encrypted_id;
        Level currentLevel;
    }

    constructor() {}

    function newItem(uint256 internal_id, string memory name, string memory encrypted_id) public {
        supply.push();
        uint256 newIndex = supply.length - 1;

        supply[newIndex].id = newIndex;
        supply[newIndex].internal_id = internal_id;
        supply[newIndex].name = name;
        supply[newIndex].encrypted_id = encrypted_id;
        supply[newIndex].currentLevel = Level.MANUFACTURER;
    }

    function getCurrentId() public returns(uint256) {
        return current_id;
    }

    function getItem(uint256 id) public returns(Item memory) {
        return supply[current_id];
    }
}