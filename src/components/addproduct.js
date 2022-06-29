import React from "react";
import { useState } from "react";

export const AddProduct = (props) => {
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const handleOnClick = async (image, description, price, stock) => {
    if (image.length && description.length && price > 0 && stock > 0) {
      await props.addProduct(image, description, price, stock);
    } else {
      console.log("Please fill in all the required fields");
    }
  };
  return (
    <div className="mt-4 d-flex justify-content-center">
      <form>
        <h3 className="fs-2">Add a product</h3>
        <div className="form-row">
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="image"
            required
          />

          <input
            type="text"
            className="form-control mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            required
          />

          <input
            type="text"
            className="form-control mt-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="price"
            required
          />

          <input
            type="text"
            className="form-control mt-2"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="No of Available Product"
            required
          />

          <button
            type="button"
            onClick={handleOnClick}
            className="btn btn-info mt-2 mb-4"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};
