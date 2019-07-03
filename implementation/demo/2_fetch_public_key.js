const Deposit = artifacts.require('./Deposit.sol')
const TBTCSystemStub = artifacts.require('./TbtcSystemStub.sol')

module.exports = async function() {
  let deposit
  let depositLog

  try {
    deposit = await Deposit.deployed()
    depositLog = await TBTCSystemStub.deployed()
  } catch (err) {
    console.error(`initialization failed: ${err}`)
    process.exit(1)
  }

  async function getPublicKey() {
    const blockNumber = await web3.eth.getBlock('latest').number

    console.log('Call getPublicKey')
    const result = await deposit.retrieveSignerPubkey()
      .catch((err) => {
        console.error(`retrieveSignerPubkey failed: ${err}`)
        process.exit(1)
      })

    console.log('retrieveSignerPubkey transaction: ', result.tx)

    const eventList = await depositLog.getPastEvents('RegisteredPubkey', {
      fromBlock: blockNumber,
      toBlock: 'latest',
    })

    const publicKeyX = eventList[0].returnValues._signingGroupPubkeyX
    const publicKeyY = eventList[0].returnValues._signingGroupPubkeyY

    console.log(`Registered public key:\nX: ${publicKeyX}\nY: ${publicKeyY}`)
  }

  await getPublicKey()

  process.exit()
}
