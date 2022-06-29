import React from "react";
import { useState } from "react";

export const Products = (props) => {
  const [amount, setAmount] = useState(0);
  const [newprice, setNewprice] = useState(0);

  return (
    <div className="card-container">
      {props.products.map((product) => (
        <div className="card" key={product.index}>
          <img
            className="card-img-top"
            src={product.image}
            alt="Card cap"
          />
          <div className="card-body">
            <h5 className="card-title">{product.sold} Products Sold</h5>
            <h5 className="card-title">
              {product.stock > 0
                ? `${product.stock} Products Available`
                : `Sold out`}
            </h5>
            <p className="card-text">{product.description}</p>
            <p className="card-title">
              Price: {product.price / 1000000000000000000}cUSD
            </p>
            {props.walletAddress !== product.owner &&
              product.stock > 0 && (
                <button
                  type="button"
                  onClick={() => props.buyProduct(product.index)}
                  className="btn btn-dark mt-2"
                >
                  Buy Product
                </button>
              )}

            {props.walletAddress === product.owner && (
              <form>
                <div className="form-r">
                <h6 className="fs-5 mt-2">Add inventory</h6>
                  <input
                    type="text"
                    className="form-control mt-4"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="new price"
                  />
                  <button
                    type="button"
                    onClick={() => props.addInventory(product.index, amount)}
                    className="btn btn-primary mt-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {props.walletAddress === product.owner && (
              <form>
                <h6 className="fs-5 mt-2">Change price</h6>
                <div className="form-r">
                  <input
                    type="text"
                    className="form-control mt-4"
                    value={newprice}
                    onChange={(e) => setNewprice(e.target.value)}
                    placeholder="enter amount to add to inventory"
                  />
                  <button
                    type="button"
                    onClick={() => props.modifyPrice(product.index, newprice)}
                    className="btn btn-primary mt-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {props.walletAddress === product.owner && (
              <form>
                <h6 className="fs-5 mt-2">Reduce inventory</h6>
                <div className="form-r">
                  <input
                    type="text"
                    className="form-control mt-4"
                    value={amount}
                    onChange={(e) => 
                     
                      setAmount(e.target.value)
                    }
                    placeholder="enter amount to remove from inventory"
                  />
                  <button
                    type="button"
                    onClick={() =>{
                      if(amount > product.stock || amount === 0){
                        alert("Amount for reducing inventory has to be less than or equal to current stock availability");
                      }else{
                        props.reduceInventory(product.index, amount)
                      }
                      
                    }}
                    className="btn btn-primary mt-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
             {props.walletAddress === product.owner && (
              <form>
                <h6 className="fs-5 mt-2">Unlist product</h6>
                <div className="form-r">
                  <button
                    type="button"
                    onClick={() =>
                      props.unlistProduc(product.index)
                    }
                    className="btn btn-primary mt-2"
                  >
                    Unlist product
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
