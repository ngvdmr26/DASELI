import { deseliProducts, categories } from '../../src/catalog';

export async function checkMoySkladConnection() {
  return {
    connected: true,
    message: "Connected to MoySklad API stub successfully",
    status: "ok",
    timestamp: new Date().toISOString()
  };
}

export async function createCustomerOrder(orderData: any): Promise<{ success: boolean; orderId?: string; message?: string; error?: string }> {
  console.log("Mocking MoySklad order creation:", JSON.stringify(orderData, null, 2));
  return {
    success: true,
    orderId: "MS-" + Math.floor(Math.random() * 100000),
    message: "Order synchronized with MoySklad successfully (stub mode)"
  };
}

export async function getCategories() {
  return categories;
}

export async function getProducts(categoryFilter?: string) {
  if (categoryFilter) {
    return deseliProducts.filter(p => p.category === categoryFilter);
  }
  return deseliProducts;
}

export async function getStock(productIdFilter?: string) {
  if (productIdFilter) {
    const product = deseliProducts.find(p => p.id === productIdFilter);
    return [{
      productId: productIdFilter,
      inStock: product ? product.inStock : true,
      quantity: 10,
      reserve: 0
    }];
  }
  return deseliProducts.map(p => ({
    productId: p.id,
    inStock: p.inStock,
    quantity: p.inStock ? 15 : 0,
    reserve: 0
  }));
}

export async function runSetup() {
  return {
    success: true,
    setupCompleted: true,
    logs: [
      "Checking catalog...",
      "Mapping products in MoySklad...",
      "Configuring webhooks (stub)...",
      "Setup complete! Catalog is synchronized."
    ]
  };
}
