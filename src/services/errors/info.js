export const generateProductsErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
      List of required properties:
      * title: needs to be a String, received ${product.title}
      * description: needs to be a String, received ${product.description}
      * code: must be unique, received ${product.code}
      * price: needs to be a Number, received ${product.number}
      * stock: needs to be a Number, received ${product.stock}
      * category: needs to be a String, received ${product.category}`;
  };