export const EmailRecoveryManagerAbi = [
    {
        "type": "function",
        "name": "MINIMUM_RECOVERY_WINDOW",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "acceptanceSubjectTemplates",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string[][]",
                "internalType": "string[][]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "addGuardian",
        "inputs": [
            {
                "name": "guardian",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "weight",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "cancelRecovery",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "changeThreshold",
        "inputs": [
            {
                "name": "threshold",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "completeRecovery",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "recoveryData",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "computeAcceptanceTemplateId",
        "inputs": [
            {
                "name": "templateIdx",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "computeEmailAuthAddress",
        "inputs": [
            {
                "name": "recoveredAccount",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "accountSalt",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "computeRecoveryTemplateId",
        "inputs": [
            {
                "name": "templateIdx",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "configureRecovery",
        "inputs": [
            {
                "name": "guardians",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "weights",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "threshold",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "delay",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "dkim",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "dkimAddr",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "emailAuthImplementation",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "emailAuthImplementationAddr",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "extractRecoveredAccountFromAcceptanceSubject",
        "inputs": [
            {
                "name": "subjectParams",
                "type": "bytes[]",
                "internalType": "bytes[]"
            },
            {
                "name": "templateIdx",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "extractRecoveredAccountFromRecoverySubject",
        "inputs": [
            {
                "name": "subjectParams",
                "type": "bytes[]",
                "internalType": "bytes[]"
            },
            {
                "name": "templateIdx",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getGuardian",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "guardian",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct GuardianStorage",
                "components": [
                    {
                        "name": "status",
                        "type": "uint8",
                        "internalType": "enum GuardianStatus"
                    },
                    {
                        "name": "weight",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getGuardianConfig",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct IGuardianManager.GuardianConfig",
                "components": [
                    {
                        "name": "guardianCount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "totalWeight",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "acceptedWeight",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "threshold",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRecoveryConfig",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct IEmailRecoveryManager.RecoveryConfig",
                "components": [
                    {
                        "name": "delay",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "expiry",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRecoveryRequest",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct IEmailRecoveryManager.RecoveryRequest",
                "components": [
                    {
                        "name": "executeAfter",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "executeBefore",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "currentWeight",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "recoveryDataHash",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "handleAcceptance",
        "inputs": [
            {
                "name": "emailAuthMsg",
                "type": "tuple",
                "internalType": "struct EmailAuthMsg",
                "components": [
                    {
                        "name": "templateId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "subjectParams",
                        "type": "bytes[]",
                        "internalType": "bytes[]"
                    },
                    {
                        "name": "skipedSubjectPrefix",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "proof",
                        "type": "tuple",
                        "internalType": "struct EmailProof",
                        "components": [
                            {
                                "name": "domainName",
                                "type": "string",
                                "internalType": "string"
                            },
                            {
                                "name": "publicKeyHash",
                                "type": "bytes32",
                                "internalType": "bytes32"
                            },
                            {
                                "name": "timestamp",
                                "type": "uint256",
                                "internalType": "uint256"
                            },
                            {
                                "name": "maskedSubject",
                                "type": "string",
                                "internalType": "string"
                            },
                            {
                                "name": "emailNullifier",
                                "type": "bytes32",
                                "internalType": "bytes32"
                            },
                            {
                                "name": "accountSalt",
                                "type": "bytes32",
                                "internalType": "bytes32"
                            },
                            {
                                "name": "isCodeExist",
                                "type": "bool",
                                "internalType": "bool"
                            },
                            {
                                "name": "proof",
                                "type": "bytes",
                                "internalType": "bytes"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "templateIdx",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "handleRecovery",
        "inputs": [
            {
                "name": "emailAuthMsg",
                "type": "tuple",
                "internalType": "struct EmailAuthMsg",
                "components": [
                    {
                        "name": "templateId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "subjectParams",
                        "type": "bytes[]",
                        "internalType": "bytes[]"
                    },
                    {
                        "name": "skipedSubjectPrefix",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "proof",
                        "type": "tuple",
                        "internalType": "struct EmailProof",
                        "components": [
                            {
                                "name": "domainName",
                                "type": "string",
                                "internalType": "string"
                            },
                            {
                                "name": "publicKeyHash",
                                "type": "bytes32",
                                "internalType": "bytes32"
                            },
                            {
                                "name": "timestamp",
                                "type": "uint256",
                                "internalType": "uint256"
                            },
                            {
                                "name": "maskedSubject",
                                "type": "string",
                                "internalType": "string"
                            },
                            {
                                "name": "emailNullifier",
                                "type": "bytes32",
                                "internalType": "bytes32"
                            },
                            {
                                "name": "accountSalt",
                                "type": "bytes32",
                                "internalType": "bytes32"
                            },
                            {
                                "name": "isCodeExist",
                                "type": "bool",
                                "internalType": "bool"
                            },
                            {
                                "name": "proof",
                                "type": "bytes",
                                "internalType": "bytes"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "templateIdx",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "isActivated",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "recoverySubjectTemplates",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string[][]",
                "internalType": "string[][]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "removeGuardian",
        "inputs": [
            {
                "name": "guardian",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "subjectHandler",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "updateRecoveryConfig",
        "inputs": [
            {
                "name": "recoveryConfig",
                "type": "tuple",
                "internalType": "struct IEmailRecoveryManager.RecoveryConfig",
                "components": [
                    {
                        "name": "delay",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "expiry",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "verifier",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "verifierAddr",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "AddedGuardian",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "guardian",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "weight",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ChangedThreshold",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "threshold",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "GuardianAccepted",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "guardian",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "GuardianStatusUpdated",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "guardian",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "newStatus",
                "type": "uint8",
                "indexed": false,
                "internalType": "enum GuardianStatus"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RecoveryCancelled",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RecoveryCompleted",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RecoveryConfigUpdated",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "delay",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RecoveryConfigured",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "guardianCount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "totalWeight",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "threshold",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RecoveryDeInitialized",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RecoveryProcessed",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "guardian",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "executeAfter",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "executeBefore",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "recoveryDataHash",
                "type": "bytes32",
                "indexed": false,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RemovedGuardian",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "guardian",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "weight",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "AccountNotConfigured",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AddressAlreadyGuardian",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AddressNotGuardianForAccount",
        "inputs": []
    },
    {
        "type": "error",
        "name": "DelayMoreThanExpiry",
        "inputs": [
            {
                "name": "delay",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "DelayNotPassed",
        "inputs": [
            {
                "name": "blockTimestamp",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "executeAfter",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "IncorrectNumberOfWeights",
        "inputs": [
            {
                "name": "guardianCount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "weightCount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidAccountAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidDkimRegistry",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidEmailAuthImpl",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidGuardianAddress",
        "inputs": [
            {
                "name": "guardian",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidGuardianStatus",
        "inputs": [
            {
                "name": "guardianStatus",
                "type": "uint8",
                "internalType": "enum GuardianStatus"
            },
            {
                "name": "expectedGuardianStatus",
                "type": "uint8",
                "internalType": "enum GuardianStatus"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidGuardianWeight",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidRecoveryDataHash",
        "inputs": [
            {
                "name": "recoveryDataHash",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "expectedRecoveryDataHash",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ]
    },
    {
        "type": "error",
        "name": "InvalidSubjectHandler",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidVerifier",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaxNumberOfGuardiansReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoRecoveryConfigured",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoRecoveryInProcess",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotEnoughApprovals",
        "inputs": [
            {
                "name": "currentWeight",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "threshold",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "RecoveryInProcess",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RecoveryIsNotActivated",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RecoveryRequestExpired",
        "inputs": [
            {
                "name": "blockTimestamp",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "executeBefore",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "RecoveryWindowTooShort",
        "inputs": [
            {
                "name": "recoveryWindow",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "SetupAlreadyCalled",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SetupNotCalled",
        "inputs": []
    },
    {
        "type": "error",
        "name": "StatusCannotBeTheSame",
        "inputs": [
            {
                "name": "newStatus",
                "type": "uint8",
                "internalType": "enum GuardianStatus"
            }
        ]
    },
    {
        "type": "error",
        "name": "ThresholdCannotBeZero",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ThresholdExceedsAcceptedWeight",
        "inputs": [
            {
                "name": "threshold",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "acceptedWeight",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "ThresholdExceedsTotalWeight",
        "inputs": [
            {
                "name": "threshold",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "totalWeight",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    }
] as const;