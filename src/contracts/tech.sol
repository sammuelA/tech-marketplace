// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract TechProduct {
    uint256 private productsLength = 0;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Product {
        address payable owner;
        string image;
        string description;
        uint256 price;
        uint256 stock;
        uint256 sold;
    }

    mapping(uint256 => Product) private products;

    mapping(uint256 => bool) private deleted;


    event AddProduct(uint index, address owner);
    event DeleteProduct(uint index);
    event AddInventory(uint index, uint amount, uint total);
    event ReduceInventory(uint index, uint amount, uint total);

    modifier checkOwner(uint256 _index) {
        require(
            msg.sender == products[_index].owner,
            "only product owner can perform this action"
        );
        _;
    }

    modifier isDeleted(uint _index){
        require(!deleted[_index], "Product has already been deleted");
        _;
    }

    // add a new product
    function addProduct(
        string memory _image,
        string memory _description,
        uint256 _price,
        uint256 _stock
    ) public {
        require(bytes(_image).length > 7, "Enter a valid image uri"); // ipfs links starts with ipfs://
        require(bytes(_description).length > 0, "Enter a valid description");
        require(_price > 0, "Enter a valid price");
        require(_stock > 0, "Enter a valid inventory number");
        uint256 _sold = 0;
        products[productsLength] = Product(
            payable(msg.sender),
            _image,
            _description,
            _price,
            _stock,
            _sold
        );
        emit AddProduct(productsLength, msg.sender);
        productsLength++;
    }

    // unlisting a product  from the marketplace
    function unlistProduct(uint256 _index) external checkOwner(_index) isDeleted(_index) {
        require(_index < productsLength, "Query of non existant product");
        delete products[_index];
        deleted[_index] = true;
        emit DeleteProduct(_index);
    }

    // add more inventory
    function addInventory(uint256 _index, uint256 _amount)
        external
        isDeleted(_index) checkOwner(_index) 
    {
        require(_amount > 0, "Enter a valid amount for restocking");
        products[_index].stock = products[_index].stock + _amount;
        emit AddInventory(_index, _amount, products[_index].stock);
    }

    // reduce inventory
    function reduceInventory(uint256 _index, uint256 _amount)
        external
        isDeleted(_index) checkOwner(_index)
    {
        require(
            _amount < products[_index].stock,
            "only owner can perform transaction"
        );
        products[_index].stock = products[_index].stock - _amount;
        emit ReduceInventory(_index, _amount, products[_index].stock);
    }

    // getting product
    function getProduct(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            products[_index].owner,
            products[_index].image,
            products[_index].description,
            products[_index].price,
            products[_index].stock,
            products[_index].sold
        );
    }

    //buying a product
    function buyProduct(uint256 _index) public payable isDeleted(_index) {
        require(msg.sender != products[_index].owner, "You can't buy your own products");
        require(products[_index].stock > 0, "Sold out");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                products[_index].owner,
                products[_index].price
            ),
            "Transfer failed."
        );
        products[_index].sold++;
        products[_index].stock--;
    }

    // to get the length of products in the mapping
    function getProductsLength() public view returns (uint256) {
        return (productsLength);
    }
}
