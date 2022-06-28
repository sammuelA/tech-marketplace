
import './App.css';

import { NavigationBar } from './components/navigation';
import { Products } from './components/products';
import { AddProduct } from './components/addproduct';


import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import tech from "./contracts/tech.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;



const contractAddress = "0x50E058D38Aa084A77D5f166181913C1D443141e2";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [products, setProducts] = useState([]);
  


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(tech, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  const getProducts = useCallback(async () => {
    const productsLength = await contract.methods.getProductsLength().call();
    const products = [];
    for (let index = 0; index < productsLength; index++) {
      let _products = new Promise(async (resolve, reject) => {
      let product = await contract.methods.getProduct(index).call();

        resolve({
          index: index,
          owner: product[0],
          image: product[1],
          description: product[2],
          price: product[3],
          noOfAvailable: product[4],
          sold: product[4]   
        });
      });
      products.push(_products);
    }

    const _products = await Promise.all(products);
    setProducts(_products);
  }, [contract]);


  const addProduct = async (
    _image,
    _description,
    _price,
    _noOfAvailable
 
  ) => {
    let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addProduct(_image, _description, price, _noOfAvailable)
        .send({ from: address });
      getProducts();
    } catch (error) {
      alert(error);
    }
  };

  const modifyPrice = async (_index, _price) => { 
    const price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods.modifyPrice(_index, price).send({ from: address });
      getProducts();
      alert("you have successfully changed the price");
     
    } catch (error) {
      alert(error);
    }};



    const addInventory = async (
      _index,
      _ammount
    ) => {
      try {
        await contract.methods
          .addInventory(_index, _ammount)
          .send({ from: address });
        getProducts();
      } catch (error) {
        alert(error);
      }
    };

    const reduceInventory = async (
      _index,
      _ammount
   
    ) => {
      try {
        await contract.methods
          .reduceInventory(_index, _ammount)
          .send({ from: address });
        getProducts();
      } catch (error) {
        alert(error);
      }
    };
  



  const unlistProduct = async (
    _index
  ) => {
    try {
      await contract.methods
        .unlistProduct(_index)
        .send({ from: address });
      getProducts();
    } catch (error) {
      alert(error);
    }
  };


  const buyProduct = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const cost = products[_index].price;
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods.buyProduct(_index).send({ from: address });
      getProducts();
      getBalance();
      alert("you have successfully bought this image");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getProducts();
    }
  }, [contract, getProducts]);
  
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <Products products={products} buyProduct={buyProduct} walletAddress={address} addInventory={addInventory} reduceInventory={reduceInventory}/>
      <AddProduct addProduct={addProduct} />
    </div>
  );
}

export default App;