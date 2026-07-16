const DELAY = 500;

let mockProducts = [
  { id: '1', name: 'Product 1', price: '10.00' },
  { id: '2', name: 'Product 2', price: '20.00' },
];

export const mockApi = {
  login: async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'test' && password === 'test') {
          resolve({ user: { id: 1, name: 'Test User', token: 'mock-token-123' } });
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, DELAY);
    });
  },

  getProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockProducts]);
      }, DELAY);
    });
  },

  addProduct: async (product) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = { ...product, id: Date.now().toString() };
        mockProducts.push(newProduct);
        resolve(newProduct);
      }, DELAY);
    });
  },

  updateProduct: async (id, updatedProduct) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
          resolve(mockProducts[index]);
        } else {
          reject(new Error('Product not found'));
        }
      }, DELAY);
    });
  },

  deleteProduct: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          const deleted = mockProducts.splice(index, 1)[0];
          resolve(deleted);
        } else {
          reject(new Error('Product not found'));
        }
      }, DELAY);
    });
  }
};
