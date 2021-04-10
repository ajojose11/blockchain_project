var Tx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const fs = require('fs');
const rpcURL = 'https://ropsten.infura.io/v3/e93b9098ce624023b96a507964d7ded8' // Your RCP URL goes here
const web3 = new Web3(rpcURL)

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "_totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
// Your ABI Goes Here.ABI stands for application binary interface.  In Ethereum, it's basically how you can encode Solidity contract calls for the EVM and, backwards, how to read the data out of transactions.


const address = '0xc315a48556542ee3fb8946af176df4c17e1f4c8e'
const owner = "0x7b7e78a9f5f6fa34e92DB8f65BbDd27eaF9191Da"
const privateKey = Buffer.from('5dc745ce9535c0410e73dc30d9b5774c5d0f46b87cb5f06061df5d792893c2e6x', 'hex')
const contract = new web3.eth.Contract(abi, address)
const decimals = web3.utils.toBN(18);
let addressList;
let len;


const getBalanceOf = async (account) => {
    let balanceOf = await contract.methods.balanceOf(account).call()
    let token = web3.utils.fromWei(balanceOf.toString(), 'ether')
    // console.log(token)
    return token

}

const sendTransaction = async (raw) => {
    return await web3.eth.sendSignedTransaction(raw)
}

const getTransactionCount = async (account) => {
    return await web3.eth.getTransactionCount(account)
}

const transferFunds = async (from, sendTo, amount) => {

    let txCount = await getTransactionCount(from)

    console.log("txCount returned: " + txCount)

    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(100000), // uses about 36,000 gas so add some buffer
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
        value: '0x0',
        from: from,
        to: address,
        data: contract.methods.transfer(sendTo, amount).encodeABI(),
    }

    const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
    tx.sign(privateKey)
    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')
    console.log(`Transfering ${web3.utils.fromWei(amount.toString(), 'ether')} token to ${sendTo}`)
    let minedTransaction = await sendTransaction(raw)
    console.log("Transaction completed with txHash: " + minedTransaction.transactionHash)
}

const distributeToken = async () => {
    console.log("Number of Address: ", len);
    let balance = await getBalanceOf(owner);
    console.log(`Balance: ${balance}`)
    let fivePercent = (5 / 100) * balance;
    let tokensToDistribute = fivePercent / len;
    console.log(`Tokens for Each Address: ${tokensToDistribute}`);
    let value = web3.utils.toWei(tokensToDistribute.toString(), 'ether')
    console.log(`Tokens for Each Address: ${value}`);

    for (i in addressList) {
        await transferFunds(owner, addressList[i], value)
    }
}
const main = async () => {
    rl.question('Please enter the name of file containing address:  ', (answer) => {
        try {
            addressList = fs.readFileSync(answer).toString().split("\n");
            len = addressList.length
            distributeToken();
        } catch (e) {
            console.log(`No file with name ${answer} found`)
        }
        rl.close();

    });

}

main();
// go()
