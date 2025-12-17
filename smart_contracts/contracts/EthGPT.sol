// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


/// @title EthGPT – On-chain AI request & response system
/// @author Mayank
/// @notice Allows users to submit AI prompts on-chain and receive responses via a trusted oracle
/// @dev Uses a flat-fee payment model and a single oracle for fulfillment
contract EthGPT is Ownable {

    enum Status{ None, Pending, Fulfilled, Cancelled }

    event AIRequested(uint256 indexed id,address indexed requester,string prompt);
    event AIFulfilled(uint256 indexed id,string response,address indexed oracle);
    event AICancelled(uint256 indexed id,address requester);

     /// @notice Stores all information related to an AI request
    struct Request{
        address requester;
        string prompt;
        string response;
        Status status;
        uint256 feePaid;
        uint256 createdAt;
        uint256 fulfilledAt;
    }

    /// @notice Mapping of request ID to Request data
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

    /// @notice Create a new AI request by submitting a prompt
    /// @dev Requires payment of at least `flatFeeWei`
    /// @param prompt The AI prompt string
    /// @return id The unique ID of the created request
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

    /// @notice Fulfill a pending AI request with a response
    /// @dev Can only be called by the oracle
    /// @param id Request identifier
    /// @param response AI-generated response text

    function fulfill(uint256 id,string calldata response) external onlyOracle{
        Request storage r = requests[id];
        require(r.status == Status.Pending,"NOT PENDING");
        r.response = response;
        r.status = Status.Fulfilled;
        r.fulfilledAt = block.timestamp;
        emit AIFulfilled(id,response,msg.sender);
    }


    /// @notice Cancel a pending AI request
    /// @dev Only the original requester can cancel
    /// @param id Request identifier

    function cancel(uint256 id) external {
        Request storage r = requests[id];
        require(r.status == Status.Pending,"NOT PENDING");
        require(r.requester == msg.sender,"NOT OWNER");
        r.status = Status.Cancelled;
        emit AICancelled(id,msg.sender);
    }

    /// @notice Withdraw all ETH balance from the contract
    /// @dev Only callable by the contract owner
    /// @param to Address that will receive the ETH

    function withdraw(address payable to) external onlyOwner{
        require(to != address(0), "NOT VALID USER");
        // (bool success,) = to.call{value: address(this).balance}("");
        to.transfer(address(this).balance);
    }

    /// @notice Update the oracle address
    /// @dev Only callable by the owner
    /// @param newOracle Address of the new oracle

    function setOracle(address newOracle) external onlyOwner{
        require(newOracle != address(0),"INVALID ORACLE ADDRESS");
        oracle = newOracle;
    }

    /// @notice Set the flat fee required to submit an AI request
    /// @dev Fee is denominated in wei
    /// @param _fee New flat fee amount

    function setFlatFeeWei(uint256 _fee) external onlyOwner {
        flatFeeWei = _fee;
    }

    /// @notice Fetch full request details by ID
    /// @param id Request identifier
    /// @return Request struct containing all request data
    function getRequest(uint256 id) external view returns(Request memory){
        return requests[id];
    }

}
