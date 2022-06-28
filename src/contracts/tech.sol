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

    event CreateProduct(uint256 index, address indexed owner);
    event BuyProduct(uint256 index, address indexed buyer);
    event ModifyPrice(uint256 index, uint256 newPrice);
    event AddInventory(uint256 index, uint256 amount);
    event ReduceInventory(uint256 index, uint256 amount);
    event UnlistProduct(uint256 index);

    modifier isOwner(uint256 _index) {
        require(products[_index].owner == msg.sender, "Only owner of product allowed!");
        _;
    }

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

        emit CreateProduct(productsLength, msg.sender);
        productsLength++;        
    }

      // unlisting a product  from the marketplace
        function unlistProduct(uint _index) external isOwner(_index) {	            
            products[_index] = products[productsLength - 1];
            delete products[productsLength - 1];
            productsLength--; 

            emit UnlistProduct(_index);
	 }

      // to change the price of a picture in the list
         function modifyPrice(uint _index, uint _newPrice) public isOwner(_index) {        
        products[_index].price = _newPrice;
        emit ModifyPrice(_index, _newPrice);
    }

// add more inventory
    function addInventory(uint _index, uint _ammount) external isOwner(_index){        
        products[_index].noOfAvailable = products[_index].noOfAvailable + _ammount;
        emit AddInventory(_index, _ammount);
    }

// reduce inventory
    function reduceInventory(uint _index, uint _ammount) external isOwner(_index) {        
        products[_index].noOfAvailable = products[_index].noOfAvailable - _ammount;
        emit ReduceInventory(_index, _ammount);
    }


// to get pictures from the list
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


    // to buy a picture
    function buyProduct(uint _index) public payable  {
        require(products[_index].noOfAvailable > 0, "Product out of stock!");
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

        emit BuyProduct(_index, msg.sender);
    }

    
    // to get the length of a picture
    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }
}