# EthGPT

EthGPT is a simple oracle-based smart contract system that allows users to submit AI prompts on-chain and receive responses from a trusted off-chain oracle.

This project focuses on clean Solidity design, access control, state management, and comprehensive unit testing using Foundry.

---

## ✨ Features

- Users can submit AI prompts by paying a flat ETH fee
- Requests follow a clear lifecycle: Pending → Fulfilled / Cancelled
- Only a trusted oracle can fulfill requests
- Requesters can cancel pending requests
- Contract owner can update oracle and fee
- Secure ETH withdrawal by owner

---

## 🧱 Architecture Overview

- **Users** create AI requests with ETH
- **Oracle** submits responses off-chain and fulfills requests on-chain
- **Owner** manages oracle address and fee configuration

The contract uses a simple state machine to ensure requests cannot be fulfilled or cancelled more than once.

---

## 🔐 Security Considerations

- Access control enforced via OpenZeppelin `Ownable`
- Oracle-restricted fulfillment
- Explicit request state validation
- No external calls during state transitions
- ETH transfers restricted to owner only

---

## 🧪 Testing

- Written using **Foundry**
- Unit tests cover:
  - Request creation
  - Oracle fulfillment
  - Cancellation logic
  - Revert scenarios
  - Access control
  - ETH withdrawals
- **100% test coverage achieved**

Tests include revert reason assertions and enum state validation.

---

## 🛠 Tech Stack

- Solidity `^0.8.28`
- Foundry (forge)
- OpenZeppelin Contracts

---

## 🚀 Future Improvements

- Refund logic on cancellation
- Multiple oracle support
- Request expiration mechanism
- Event indexing optimizations
- Integration with Chainlink / off-chain automation

---

## ⚠️ Disclaimer

This project is for learning and portfolio demonstration purposes.
It has not been audited and should not be used in production.
