// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EthGPT is Ownable {

    enum Status{ None, Pending, Fulfilled, Cancelled }

    event AIRequested(uint256 indexed id,address indexed requester,string prompt);
    event AIFulfilled(uint256 indexed id,string response,address indexed oracle);
    event AICancelled(uint256 indexed id,address requester);

    struct Request{
        address requester;
        string prompt;
        string response;
        Status status;
        uint256 feePaid;
        uint256 createdAt;
        uint256 fulfilledAt;
    }

    mapping(uint256 => Request) public requests;

    uint256 public flatFeeWei = 0;
    uint256 public nextId = 1; 
    address public oracle;



    constructor(address _oracle) Ownable(msg.sender) {
        require(_oracle != address(0),"INVALID ORACLE");
        oracle = _oracle;
    }

    modifier onlyOracle() {
        require(msg.sender == address(oracle),"ONLY ORACLE CAN CALL");
        _;
    }


    function requestAI(string calldata prompt) external payable returns(uint256 id){
        require(bytes(prompt).length > 0 ,"EMPTY PROMPT");
        require(msg.value >= flatFeeWei, "FEE TOO LOW");
        id = nextId++;
        requests[id] = Request({
            requester: msg.sender,
            prompt: prompt,
            response: "",
            status: Status.Pending,
            feePaid: msg.value,
            createdAt: block.timestamp,
            fulfilledAt: 0
        });
        emit AIRequested(id,msg.sender,prompt);
    }

    function fulfill(uint256 id,string calldata response) external onlyOracle{
        Request storage r = requests[id];
        require(r.status == Status.Pending,"NOT PENDING");
        r.response = response;
        r.status = Status.Fulfilled;
        r.fulfilledAt = block.timestamp;
        emit AIFulfilled(id,response,msg.sender);
    }


    function cancel(uint256 id) external {
        Request storage r = requests[id];
        require(r.status == Status.Pending,"NOT PENDING");
        require(r.requester == msg.sender,"NOT OWNER");
        r.status = Status.Cancelled;
        emit AICancelled(id,msg.sender);
    }

    function withdraw(address payable to) external onlyOwner{
        require(to != address(0), "NOT VALID USER");
        // (bool success,) = to.call{value: address(this).balance}("");
        to.transfer(address(this).balance);
    }

    function setOracle(address newOracle) external onlyOwner{
        require(newOracle != address(0),"INVALID ORACLE ADDRESS");
        oracle = newOracle;
    }

    function setFlatFeeWei(uint256 _fee) external onlyOwner {
        flatFeeWei = _fee;
    }

    function getRequest(uint256 id) external view returns(Request memory){
        return requests[id];
    }
    
   
}
