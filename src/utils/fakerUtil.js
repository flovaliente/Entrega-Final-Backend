import { fakerES as faker } from '@faker-js/faker';

export const generateProduct = () => {
    return {
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.string.alphanumeric(6),
      price: faker.commerce.price(),
      status: faker.datatype.boolean(0.5),
      stock: faker.number.int({ min: 0, max: 100 }),
      category: faker.commerce.productAdjective(),
      thumbnail: faker.image.url({ height: 100, width: 100 })
    };
};

export const generateProducts = (num = 100) => {
    const products = [];
    for (let i = 0; i < num; i++) {
      products.push(generateProduct());
    }
    return products;
  };