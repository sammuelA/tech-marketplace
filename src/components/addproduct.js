import React from 'react';
import { useState } from "react";

export const AddProduct = (props) => {

const [image, setImage] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [noOfAvailable, setNoOfAvailable] = useState('');


  return <div>
      <form>
  <div class="form-row">
    
      <input type="text" class="form-control" value={image}
           onChange={(e) => setImage(e.target.value)} placeholder="image"/>
           
      <input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="description"/>

      <input type="text" class="form-control mt-2" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

<input type="text" class="form-control mt-2" value={noOfAvailable}
           onChange={(e) => setNoOfAvailable(e.target.value)} placeholder="No of Available Product"/>


      <button type="button" onClick={()=>props.addProduct(image, description, price, noOfAvailable)} class="btn btn-info mt-2">Add Product</button>
  </div>
</form>
  </div>;
};
