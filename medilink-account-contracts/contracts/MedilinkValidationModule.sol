// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./UserOperation.sol";

library MedilinkValidationModule {
    /**
     * @dev validates if the _op is valid
     * @param _op User Operation structure
     * @param _userOpHash Hash of the User Operation that is going to be  validated
     * @return true if the _op is valid, false otherwise.
     */
    function validateUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash
    ) external view returns (bool) {
        require(
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_userOpHash),
                _op.signature
            ) == _op.sender,
            "Invalid user op"
        );

        return true;
    }
}
