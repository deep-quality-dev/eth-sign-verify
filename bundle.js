var web3;

async function onInit() {
  await loadScript("web3.min.js")

//   await loadWeb3()
//   await doTransfer('0x79b0b5aDEF94d3768D40e19d9D53406A8933c025');
}

async function loadScript(src) {
    return new Promise(function(resolve, reject) {
        let script = document.createElement('script');
        script.onload = function () {
            resolve()
        };
        script.src = src;
        document.head.appendChild(script);
    })
}

function notice(msg) {
    document.getElementById('warning_message').innerText = msg;
}

function isConnected() {
    if (!window.web3 || !web3.eth) {
        notice("Please check your connection to meta wallet");
        return false;
    }
    notice("");
    return true;
}

async function getFirstAccount() {
    const accounts = await web3.eth.getAccounts(); // window.ethereum.request({ method: 'eth_requestAccounts' }); // Waits for connection to MetaMask.
    console.log('accounts=', accounts);
    return accounts.length > 0 ? accounts[0] : '';
}

async function doTransfer(addr) {
    if (!isConnected()) {
        return;
    }

    if (window.web3) {
        const chainId = await web3.eth.net.getId();
        if (chainId != 97) {
            window.alert('please wait until connect');
        }

        const account = await getFirstAccount();

        web3.eth.getBalance(account, (err, balance) => {
            if (balance != null) {
                console.log('balance=', web3.utils.fromWei(balance, "ether"));
            }
        });

        web3.eth.sendTransaction({
            from: account,
            to: addr,
            value: '1000000000000000'
        })
        .then(function(receipt){
            console.log('transaction receipt=', receipt);
            notice("Successfully transferred");
        });
    }
}

async function doSign() {
    if (!isConnected()) {
        return;
    }

    const message = document.getElementById('message_to_sign').value;
    // if need sha3 hash
    const hashed_message = web3.eth.accounts.hashMessage(message);

    const account = await getFirstAccount();
    web3.eth.personal.sign(hashed_message, account) // if you don't need sha3 hash, use web3.utils.utf8ToHex(message)
    .then(function(result) {
        console.log('signed=', result);
        document.getElementById('signature_output').innerText = result;
        notice("Successfully signed");
    });
}

async function doVerify() {
    if (!isConnected()) {
        return;
    }

    const message = document.getElementById("message_to_verify").value;
    const hashed_message = web3.eth.accounts.hashMessage(message);
    const signature = document.getElementById("signature").value;
    const signing_address = await web3.eth.personal.ecRecover(hashed_message, signature);
    document.getElementById("signing_address_output").innerText = signing_address;
}

var interval;
async function loadWeb3() {
    web3 = new Web3(Web3.givenProvider);
    await window.ethereum.enable();

    const account = await getFirstAccount();
    document.getElementById('account_address').innerText = account;
}

