pragma solidity ^0.4.17;

contract Inbox {
    string public message;

    constructor(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function doMath(int256 a, int256 b) {
        a + b;
        a - b;
        a * b;
        a == 0;
    }
}
