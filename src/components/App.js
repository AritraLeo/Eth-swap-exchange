import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
// import ethereum from ''
import { ethers } from "ethers";

class App extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    // console.log(window.web3);
  }

  async loadBlockchainData() {
    const network = 'Ganache';
    const provider = ethers.getDefaultProvider(network)
    // const web3 = window.web3;
    const ethereum = window.ethereum;
    // const accounts = await web3.eth.getAccounts()
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    this.setState({ account: accounts[0] });
    // console.log(this.state.account);
    const ethBalance = await provider.getBalance(this.state.account)
    this.setState({ ethBalance: ethBalance });
  }

  async loadWeb3() {
    window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    });
  }

  constructor(props) {
    super(props)
    this.state = {
      account: ''
    }
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                <h1>Dapp University Starter Kit</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
