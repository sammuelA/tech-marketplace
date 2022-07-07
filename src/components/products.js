import React from 'react';
import { useState } from "react";

export const Products = (props) => {

  const [addammount, setaddAmmount] = useState(0);
  const [reduceammount, setreduceAmmount] = useState(0);
  const [newprice, setNewprice] = useState(0);



  return <div className="card-container">

{props.products.map((product) =>(
    <div class="card">
    <img class="card-img-top" src={product.image} alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{product.sold} Products Sold</h5>
      <h5 class="card-title">{product.noOfAvailable > 0 ? `${product.noOfAvailable} Products Available` : `Sold out`}</h5>
      <p class="card-text">{product.description}</p>
      <p class="card-title">Price: {product.price  / 1000000000000000000}cUSD</p>
      { props.walletAddress !== product.owner && product.noOfAvailable !== 0 &&(
      <button type="button" onClick={()=>props.buyProduct(product.index)} class="btn btn-dark mt-2">Buy Product</button>
      )
}

{ props.walletAddress === product.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={addammount}
           onChange={(e) => setaddAmmount(e.target.value)} placeholder="enter ammount to add to inventory"/>
      <button type="button" onClick={()=>props.addInventory(product.index, ammount)} class="btn btn-primary mt-2">add Inventory</button>
      
  </div>
</form>
)}



      { props.walletAddress === product.owner && (
                   <form>
                   <div class="form-r">
                       <input type="text" class="form-control mt-4" value={reduceammount}
                            onChange={(e) => setreduceAmmount(e.target.value)} placeholder="enter ammount to remove from inventory"/>
                       <button type="button" onClick={()=>props.reduceInventory(product.index, ammount)} class="btn btn-primary mt-2">reduce inventory</button>
                       
                   </div>
                 </form>
                       )}

{ props.walletAddress === product.owner && (
     <form>
  <div class="form-r">
      <input type="text" class="form-control mt-4" value={newprice}
           onChange={(e) => setNewprice(e.target.value)} placeholder="new price"/>
      <button type="button" onClick={()=>props.modifyPrice(product.index, newprice)} class="btn btn-primary mt-2">Change Price</button>
      
  </div>
</form>
)}
    </div>
  </div>
  ))}

</div>
};
