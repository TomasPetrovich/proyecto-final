const { faker } = require('@faker-js/faker');

const generateMockProduct = () => {
    return {
        _id: faker.string.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        img: faker.image.url(),
        code: faker.string.uuid(),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        status: faker.datatype.boolean()
    };
};

const generateMockProducts = (count = 100) => {
    return Array.from({ length: count }, generateMockProduct);
};

module.exports = {
    generateMockProducts
};