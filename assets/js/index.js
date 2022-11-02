import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const stakeButton = document.getElementById('stake')
const unstakeButton = document.getElementById('unstake')

connectButton.onclick = connect
stakeButton.onclick = stake
unstakeButton.onclick = unstake

console.log(ethers)
async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = 'Connected'
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    console.log(accounts)
  } else {
    connectButton.innerHTML = 'Please install MetaMask'
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  //listen for transaction to finish
  //Promise tells only finish this function once resolved
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Completed with ${transactionReciept.confirmations} confirmations`,
      )
      resolve()
    })
  })
}

async function stake() {
  const amount = document.getElementById('standard').value

  const stakeDays = document.getElementById('stakeDays')
  const days = stakeDays.options[stakeDays.selectedIndex].value
  console.log(`Funding with ${amount}...`)
  if ((typeof window, ethereum !== 'undefined')) {
    console.log('staking...')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.Staking(amount, days)
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
    } catch (error) {
      console.log(error)
    }
  }
}

async function unstake() {
  if ((typeof window, ethereum !== 'undefined')) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.UnStaking({})
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
    } catch (error) {
      console.log(error)
    }
  }
}

$(document).ready(function () {
  /*	Disables mobile keyboard from displaying when clicking +/- inputs */

  $('.input-number-decrement').attr('readonly', 'readonly')
  $('.input-number-increment').attr('readonly', 'readonly')

  /*Attributes variables with min and max values for counter*/

  var min = $('.input-number-decrement').data('min')
  var max = $('.input-number-increment').data('max')

  /*Incrementally increases the value of the counter up to max value, and ensures +/- input works when input has no value (i.e. when the input-number field has been cleared) */

  $('.input-number-increment').on('click', function () {
    var $incdec = $(this).prev()

    if ($incdec.val() == '') {
      $incdec.val(1)
    } else if ($incdec.val() < max) {
      $incdec.val(parseInt($incdec.val()) + 1)
    }
  })

  /*Incrementally decreases the value of the counter down to min value, and ensures +/- input works when input has no value (i.e. when the input-number field has been cleared) */

  $('.input-number-decrement').on('click', function () {
    var $incdec = $(this).next()

    if ($incdec.val() == '') {
      $incdec.val(0)
    } else if ($incdec.val() > min) {
      $incdec.val(parseInt($incdec.val()) - 1)
    }
  })

  /* Removes any character other than a number that is entered in number input */

  var input = document.getElementsByClassName('input-number')
  $(input).on('keyup input', function () {
    this.value = this.value.replace(/[^0-9]/g, '')
  })
})
