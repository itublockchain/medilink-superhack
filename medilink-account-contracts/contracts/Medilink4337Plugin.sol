// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./UserOperation.sol";
import "./MedilinkValidationModule.sol";
import {BasePluginWithEventMetadata, PluginMetadata} from "./Base.sol";

interface ISafe {
    /// @dev Allows a Module to execute a Safe transaction without any further confirmations.
    /// @param to Destination address of module transaction.
    /// @param value Ether value of module transaction.
    /// @param data Data payload of module transaction.
    /// @param operation Operation type of module transaction.
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation
    ) external returns (bool success);
}

contract Medilink4337Plugin is BasePluginWithEventMetadata {
    address public immutable entryPoint;

    constructor(
        address _entryPoint
    )
        BasePluginWithEventMetadata(
            PluginMetadata({
                name: "Medilink4337Plugin",
                version: "0.0.1",
                requiresRootAccess: false,
                iconUrl: "",
                appUrl: ""
            })
        )
    {
        entryPoint = _entryPoint;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) external returns (uint256 validationData) {
        require(msg.sender == entryPoint, "only entry point");
        MedilinkValidationModule.validateUserOp(userOp, userOpHash);

        address payable safeAddress = payable(userOp.sender);
        ISafe senderSafe = ISafe(safeAddress);
        senderSafe.execTransactionFromModule(entryPoint, 0, "", 0);
    }

    function execTransaction(
        address safeAddress,
        address to,
        uint256 value,
        bytes calldata data
    ) external payable {
        require(msg.sender == entryPoint, "only entry point");
        ISafe safe = ISafe(safeAddress);
        require(
            safe.execTransactionFromModule(to, value, data, 0),
            "tx failed"
        );
    }
}
