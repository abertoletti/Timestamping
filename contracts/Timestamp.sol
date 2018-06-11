pragma solidity ^0.4.23;

import "./Ownable.sol";

contract Timestamp is Ownable {

    event TimestampEvent(
        uint index,
        string hashValue
    );

    mapping(uint => string) private timestamp;

    uint private count;

    function addTimestamp(string _hash) external onlyOwner {
        require(bytes(_hash).length > 0);

        count++;

        timestamp[count] = _hash;

        emit TimestampEvent(count, _hash);
    }

    function getTimestamp(uint index) external view onlyOwner returns (string) {

        return timestamp[index];
    }

    function getCount() external view onlyOwner returns (uint) {

        return count;
    }
}