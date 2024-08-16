//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// safe
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'fallback', stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: '_threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addOwnerWithThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hashToApprove', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'approveHash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'approvedHashes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_threshold', internalType: 'uint256', type: 'uint256' }],
    name: 'changeThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'dataHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'signatures', internalType: 'bytes', type: 'bytes' },
      { name: 'requiredSignatures', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkNSignatures',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'dataHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'signatures', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'checkSignatures',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'prevModule', internalType: 'address', type: 'address' },
      { name: 'module', internalType: 'address', type: 'address' },
    ],
    name: 'disableModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'domainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    name: 'enableModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
      { name: 'safeTxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'baseGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'gasToken', internalType: 'address', type: 'address' },
      { name: 'refundReceiver', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'encodeTransactionData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
      { name: 'safeTxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'baseGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'gasToken', internalType: 'address', type: 'address' },
      {
        name: 'refundReceiver',
        internalType: 'address payable',
        type: 'address',
      },
      { name: 'signatures', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execTransaction',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModule',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModuleReturnData',
    outputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'start', internalType: 'address', type: 'address' },
      { name: 'pageSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getModulesPaginated',
    outputs: [
      { name: 'array', internalType: 'address[]', type: 'address[]' },
      { name: 'next', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOwners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStorageAt',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
      { name: 'safeTxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'baseGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'gasToken', internalType: 'address', type: 'address' },
      { name: 'refundReceiver', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTransactionHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    name: 'isModuleEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'isOwner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'prevOwner', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: '_threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'handler', internalType: 'address', type: 'address' }],
    name: 'setFallbackHandler',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'guard', internalType: 'address', type: 'address' }],
    name: 'setGuard',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_owners', internalType: 'address[]', type: 'address[]' },
      { name: '_threshold', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'fallbackHandler', internalType: 'address', type: 'address' },
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'payment', internalType: 'uint256', type: 'uint256' },
      {
        name: 'paymentReceiver',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'signedMessages',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targetContract', internalType: 'address', type: 'address' },
      { name: 'calldataPayload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'simulateAndRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'prevOwner', internalType: 'address', type: 'address' },
      { name: 'oldOwner', internalType: 'address', type: 'address' },
      { name: 'newOwner', internalType: 'address', type: 'address' },
    ],
    name: 'swapOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AddedOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'approvedHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ApproveHash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'handler',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ChangedFallbackHandler',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guard',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ChangedGuard',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'threshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChangedThreshold',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DisabledModule',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EnabledModule',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExecutionFailure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutionFromModuleFailure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutionFromModuleSuccess',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'payment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExecutionSuccess',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RemovedOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SafeReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'initiator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owners',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'threshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'initializer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fallbackHandler',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SafeSetup',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'SignMsg',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// safeEmailRecoveryModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeEmailRecoveryModuleAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'verifier', internalType: 'address', type: 'address' },
      { name: 'dkimRegistry', internalType: 'address', type: 'address' },
      { name: 'emailAuthImpl', internalType: 'address', type: 'address' },
      { name: 'subjectHandler', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINIMUM_RECOVERY_WINDOW',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptanceSubjectTemplates',
    outputs: [{ name: '', internalType: 'string[][]', type: 'string[][]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'guardian', internalType: 'address', type: 'address' },
      { name: 'weight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'canStartRecoveryRequest',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'threshold', internalType: 'uint256', type: 'uint256' }],
    name: 'changeThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'recoveryData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'completeRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'templateIdx', internalType: 'uint256', type: 'uint256' }],
    name: 'computeAcceptanceTemplateId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recoveredAccount', internalType: 'address', type: 'address' },
      { name: 'accountSalt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'computeEmailAuthAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'templateIdx', internalType: 'uint256', type: 'uint256' }],
    name: 'computeRecoveryTemplateId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'guardians', internalType: 'address[]', type: 'address[]' },
      { name: 'weights', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
      { name: 'delay', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'configureRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dkim',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dkimAddr',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emailAuthImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emailAuthImplementationAddr',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'subjectParams', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'templateIdx', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'extractRecoveredAccountFromAcceptanceSubject',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'subjectParams', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'templateIdx', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'extractRecoveredAccountFromRecoverySubject',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'guardian', internalType: 'address', type: 'address' },
    ],
    name: 'getGuardian',
    outputs: [
      {
        name: '',
        internalType: 'struct GuardianStorage',
        type: 'tuple',
        components: [
          {
            name: 'status',
            internalType: 'enum GuardianStatus',
            type: 'uint8',
          },
          { name: 'weight', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getGuardianConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct IGuardianManager.GuardianConfig',
        type: 'tuple',
        components: [
          { name: 'guardianCount', internalType: 'uint256', type: 'uint256' },
          { name: 'totalWeight', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptedWeight', internalType: 'uint256', type: 'uint256' },
          { name: 'threshold', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getRecoveryConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct IEmailRecoveryManager.RecoveryConfig',
        type: 'tuple',
        components: [
          { name: 'delay', internalType: 'uint256', type: 'uint256' },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getRecoveryRequest',
    outputs: [
      {
        name: '',
        internalType: 'struct IEmailRecoveryManager.RecoveryRequest',
        type: 'tuple',
        components: [
          { name: 'executeAfter', internalType: 'uint256', type: 'uint256' },
          { name: 'executeBefore', internalType: 'uint256', type: 'uint256' },
          { name: 'currentWeight', internalType: 'uint256', type: 'uint256' },
          {
            name: 'recoveryDataHash',
            internalType: 'bytes32',
            type: 'bytes32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'emailAuthMsg',
        internalType: 'struct EmailAuthMsg',
        type: 'tuple',
        components: [
          { name: 'templateId', internalType: 'uint256', type: 'uint256' },
          { name: 'subjectParams', internalType: 'bytes[]', type: 'bytes[]' },
          {
            name: 'skipedSubjectPrefix',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'proof',
            internalType: 'struct EmailProof',
            type: 'tuple',
            components: [
              { name: 'domainName', internalType: 'string', type: 'string' },
              {
                name: 'publicKeyHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
              { name: 'maskedSubject', internalType: 'string', type: 'string' },
              {
                name: 'emailNullifier',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              { name: 'accountSalt', internalType: 'bytes32', type: 'bytes32' },
              { name: 'isCodeExist', internalType: 'bool', type: 'bool' },
              { name: 'proof', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
      { name: 'templateIdx', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'handleAcceptance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'emailAuthMsg',
        internalType: 'struct EmailAuthMsg',
        type: 'tuple',
        components: [
          { name: 'templateId', internalType: 'uint256', type: 'uint256' },
          { name: 'subjectParams', internalType: 'bytes[]', type: 'bytes[]' },
          {
            name: 'skipedSubjectPrefix',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'proof',
            internalType: 'struct EmailProof',
            type: 'tuple',
            components: [
              { name: 'domainName', internalType: 'string', type: 'string' },
              {
                name: 'publicKeyHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
              { name: 'maskedSubject', internalType: 'string', type: 'string' },
              {
                name: 'emailNullifier',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              { name: 'accountSalt', internalType: 'bytes32', type: 'bytes32' },
              { name: 'isCodeExist', internalType: 'bool', type: 'bool' },
              { name: 'proof', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
      { name: 'templateIdx', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'handleRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isActivated',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recoverySubjectTemplates',
    outputs: [{ name: '', internalType: 'string[][]', type: 'string[][]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'guardian', internalType: 'address', type: 'address' }],
    name: 'removeGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'selector',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'subjectHandler',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'recoveryConfig',
        internalType: 'struct IEmailRecoveryManager.RecoveryConfig',
        type: 'tuple',
        components: [
          { name: 'delay', internalType: 'uint256', type: 'uint256' },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'updateRecoveryConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'verifier',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'verifierAddr',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AddedGuardian',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'threshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChangedThreshold',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'GuardianAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newStatus',
        internalType: 'enum GuardianStatus',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'GuardianStatusUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecoveryCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecoveryCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'delay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'expiry',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RecoveryConfigUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'guardianCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalWeight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'threshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RecoveryConfigured',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecoveryDeInitialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecoveryExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'executeAfter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'executeBefore',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recoveryDataHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'RecoveryProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RemovedGuardian',
  },
  { type: 'error', inputs: [], name: 'AccountNotConfigured' },
  { type: 'error', inputs: [], name: 'AddressAlreadyGuardian' },
  { type: 'error', inputs: [], name: 'AddressNotGuardianForAccount' },
  {
    type: 'error',
    inputs: [
      { name: 'delay', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'DelayMoreThanExpiry',
  },
  {
    type: 'error',
    inputs: [
      { name: 'blockTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'executeAfter', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'DelayNotPassed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'guardianCount', internalType: 'uint256', type: 'uint256' },
      { name: 'weightCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectNumberOfWeights',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'InvalidAccount',
  },
  { type: 'error', inputs: [], name: 'InvalidAccountAddress' },
  { type: 'error', inputs: [], name: 'InvalidDkimRegistry' },
  { type: 'error', inputs: [], name: 'InvalidEmailAuthImpl' },
  {
    type: 'error',
    inputs: [{ name: 'guardian', internalType: 'address', type: 'address' }],
    name: 'InvalidGuardianAddress',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'guardianStatus',
        internalType: 'enum GuardianStatus',
        type: 'uint8',
      },
      {
        name: 'expectedGuardianStatus',
        internalType: 'enum GuardianStatus',
        type: 'uint8',
      },
    ],
    name: 'InvalidGuardianStatus',
  },
  { type: 'error', inputs: [], name: 'InvalidGuardianWeight' },
  {
    type: 'error',
    inputs: [
      { name: 'recoveryDataHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'expectedRecoveryDataHash',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'InvalidRecoveryDataHash',
  },
  {
    type: 'error',
    inputs: [{ name: 'selector', internalType: 'bytes4', type: 'bytes4' }],
    name: 'InvalidSelector',
  },
  { type: 'error', inputs: [], name: 'InvalidSubjectHandler' },
  { type: 'error', inputs: [], name: 'InvalidVerifier' },
  { type: 'error', inputs: [], name: 'MaxNumberOfGuardiansReached' },
  { type: 'error', inputs: [], name: 'NoRecoveryConfigured' },
  { type: 'error', inputs: [], name: 'NoRecoveryInProcess' },
  {
    type: 'error',
    inputs: [
      { name: 'currentWeight', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NotEnoughApprovals',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'RecoveryFailed',
  },
  { type: 'error', inputs: [], name: 'RecoveryInProcess' },
  { type: 'error', inputs: [], name: 'RecoveryIsNotActivated' },
  {
    type: 'error',
    inputs: [
      { name: 'blockTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'executeBefore', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'RecoveryRequestExpired',
  },
  {
    type: 'error',
    inputs: [
      { name: 'recoveryWindow', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'RecoveryWindowTooShort',
  },
  { type: 'error', inputs: [], name: 'SetupAlreadyCalled' },
  { type: 'error', inputs: [], name: 'SetupNotCalled' },
  {
    type: 'error',
    inputs: [
      { name: 'newStatus', internalType: 'enum GuardianStatus', type: 'uint8' },
    ],
    name: 'StatusCannotBeTheSame',
  },
  { type: 'error', inputs: [], name: 'ThresholdCannotBeZero' },
  {
    type: 'error',
    inputs: [
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
      { name: 'acceptedWeight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ThresholdExceedsAcceptedWeight',
  },
  {
    type: 'error',
    inputs: [
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
      { name: 'totalWeight', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ThresholdExceedsTotalWeight',
  },
] as const
