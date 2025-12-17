// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import { Test } from "../lib/forge-std/src/Test.sol";
import { EthGPT } from "../contracts/EthGPT.sol";

contract EthGptTest is Test {

    EthGPT ethgpt;
    address oracle = makeAddr("oracle");
    address user = makeAddr("user");
    uint256 newBalance = 100e18;
    uint256 fee = 1e4;

    function setUp() external {
        ethgpt = new EthGPT(oracle);
        ethgpt.setFlatFeeWei(fee);
        vm.deal(user, newBalance);
    }

    function testRequestAI() external {
        vm.prank(user);
        string memory quest = "what is html";
        uint256 id = ethgpt.requestAI{value: fee}(quest);
        EthGPT.Request memory req = ethgpt.getRequest(id);
        assertEq(req.requester,user);
        assertEq((keccak256(abi.encode(req.prompt))),(keccak256(abi.encode(quest))));
        assertEq(req.feePaid,fee);
        assert(req.status == EthGPT.Status.Pending);
    }

    function testResponseAI() external {
        vm.prank(user);
        string memory quest = "what is html";
        uint256 id = ethgpt.requestAI{value: fee}(quest);
        vm.startPrank(oracle);
        string memory res = "html is hyper text markup language";
        ethgpt.fulfill(id, res);
        EthGPT.Request memory req = ethgpt.getRequest(id);
        assert(req.requester == user);
        assert((keccak256(abi.encode(req.prompt))) == (keccak256(abi.encode(quest))));
        assert((keccak256(abi.encodePacked(req.response))) == (keccak256(abi.encodePacked(res))));
        assert(req.fulfilledAt == block.timestamp);
        assert(req.status == EthGPT.Status.Fulfilled);
        vm.stopPrank();
    }

    function testOnlyOracleCanCall() external {
        vm.prank(user);
        string memory quest = "what is html";
        uint256 id = ethgpt.requestAI{value: fee}(quest);
        string memory res = "html is hyper text markup language";
        vm.startPrank(user);
        vm.expectRevert();
        ethgpt.fulfill(id, res);
    }

    function testWithdraw() external {
        address payable newOwner = payable(makeAddr("newOwner"));
        uint256 newBal = 10e18;
        vm.deal(address(ethgpt), newBal);
        vm.prank(ethgpt.owner());
        ethgpt.withdraw(newOwner);
        assert(newOwner.balance == newBal);
    }


    function testCancelRequest() external {
        vm.startPrank(user);
        string memory quest = "what is html";
        uint256 id = ethgpt.requestAI{value: fee}(quest);
        ethgpt.cancel(id);
        EthGPT.Request memory req = ethgpt.getRequest(id);
        assert(req.status == EthGPT.Status.Cancelled);
        vm.startPrank(user);
    }

    function testChangeFees() external {
        vm.prank(ethgpt.owner());
        uint256 newFee = 1e10;
        ethgpt.setFlatFeeWei(newFee);
        vm.prank(user);
        string memory quest = "what is html";
        vm.expectRevert(abi.encodePacked("FEE TOO LOW"));
        ethgpt.requestAI{value: fee}(quest);
        assert(ethgpt.flatFeeWei() == newFee);
    }

    function testOracle() external {
        vm.prank(ethgpt.owner());
        address newOracle = makeAddr("newOracle");
        ethgpt.setOracle(newOracle);
        assert(ethgpt.oracle() == newOracle);

    }


  
}