// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TechProduct {


    uint internal productsLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Product {
        address payable owner;
        string image;
        string description;
        uint price;
        uint noOfAvailable;
        uint sold;
    }

    mapping (uint => Product) internal products;


// add a new product
    function addProduct(
        string memory _image,
        string memory _description, 
        uint _price,
        uint _noOfAvailable
    ) public {
        uint _sold = 0;
        products[productsLength] = Product(
            payable(msg.sender),
            _image,
            _description,
            _price,
            _noOfAvailable,
            _sold
        );
        productsLength++;
    }

      // unlisting a product  from the marketplace
        function unlistProduct(uint _index) external {
	        require(msg.sender == products[_index].owner, "can't delete picture");         
            products[_index] = products[productsLength - 1];
            delete products[productsLength - 1];
            productsLength--; 
	 }


// add more inventory
    function addInventory(uint _index, uint _ammount) external{
        require(msg.sender == products[_index].owner, "only owner can perform transaction");
        require(_ammount != 0 , "only owner can perform transaction");
        products[_index].noOfAvailable = products[_index].noOfAvailable + _ammount;
    }

// reduce inventory
    function reduceInventory(uint _index, uint _ammount) external{
        require(msg.sender == products[_index].owner, "only owner can perform transaction");
        require(_ammount < products[_index].noOfAvailable, "only owner can perform transaction");
        products[_index].noOfAvailable = products[_index].noOfAvailable - _ammount;
    }


// getting product
    function getProduct(uint _index) public view returns (
        address payable, 
        string memory, 
        string memory, 
        uint, 
        uint,
        uint
    ) {
        return (
            products[_index].owner,
            products[_index].image,
            products[_index].description,
            products[_index].price,
            products[_index].noOfAvailable,
            products[_index].sold
          
        );
    }


    //buying a product
    function buyProduct(uint _index) public payable  {
        require(products[_index].noOfAvailable > 0, "Sold out");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            products[_index].owner,
            products[_index].price
          ),
          "Transfer failed."
        );
        products[_index].sold++;
        products[_index].noOfAvailable--;
    }

    
    // to get the length of products in the mapping
    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }
}