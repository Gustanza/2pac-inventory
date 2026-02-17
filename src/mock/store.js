// Frontend-only mock store used to simulate backend behavior.

// This is for development/demo only and must be replaced with real API calls later.



import { reactive } from 'vue';



const state = reactive({

  users: [

    { id: 'user-1', name: 'John Doe', email: 'john@example.com' },

    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },

    { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com' },

    { id: 'user-4', name: 'Alice Brown', email: 'alice@example.com' },

    { id: 'user-5', name: 'Charlie Wilson', email: 'charlie@example.com' },

  ],

  shops: [

    {

      id: 'shop-1',

      name: 'Downtown Store',

      description: 'Primary demo shop',

      users: ['user-1', 'user-2'],

    },

  ],

  categories: [

    { id: 'cat-1', name: 'Beverages', description: 'Coffee, tea, juices, and other drinks' },

    { id: 'cat-2', name: 'Food', description: 'Snacks, meals, and consumable food items' },

    { id: 'cat-3', name: 'Electronics', description: 'Electronic devices and accessories' },

    { id: 'cat-4', name: 'Clothing', description: 'Apparel and fashion items' },

    { id: 'cat-5', name: 'Office Supplies', description: 'Stationery and office equipment' },

    { id: 'cat-6', name: 'Health & Beauty', description: 'Personal care and beauty products' },

    { id: 'cat-7', name: 'Home & Garden', description: 'Household items and garden supplies' },

    { id: 'cat-8', name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },

  ],

  products: [

    {

      id: 'prod-1',

      shopId: 'shop-1',

      name: 'Premium Coffee Beans',

      categoryId: 'cat-1',

      category: 'Beverages',

      baseUnit: 'bag',

      allowFractional: false,

      minSellableUnit: '1 bag',

      units: [

        { name: 'bag', multiplier: 1 },

        { name: 'box', multiplier: 10 },

      ],

      currentStockDisplay: '50 bags (simulated)',

    },

  ],

  stockHistory: [],

});



let counters = {

  shop: 2,

  product: 2,

  category: 9,

  movement: 1,

};



export function useMockStore() {

  // Users

  const listUsers = () => state.users;

  

  const searchUsers = (query) => {

    if (!query) return state.users;

    const lowerQuery = query.toLowerCase();

    return state.users.filter(user => 

      user.name.toLowerCase().includes(lowerQuery) || 

      user.email.toLowerCase().includes(lowerQuery)

    );

  };



  const getUserById = (id) => state.users.find(u => u.id === id);



  // Shops

  const listShops = () => state.shops;



  const createShop = (name, userIds = []) => {

    const shop = {

      id: `shop-${counters.shop++}`,

      name,

      description: 'Simulated shop',

      users: userIds,

    };

    state.shops.push(shop);

    return shop;

  };



  // Products

  const listProducts = () => state.products;



  const getProductById = (id) => state.products.find((p) => p.id === id);



  const upsertProduct = (id, payload) => {

    if (id) {

      const existing = getProductById(id);

      if (!existing) return null;

      Object.assign(existing, payload);

      return existing;

    }

    const product = {

      id: `prod-${counters.product++}`,

      shopId: payload.shopId || state.shops[0]?.id || null,

      ...payload,

      currentStockDisplay: payload.currentStockDisplay || '0 (simulated)',

    };

    state.products.push(product);

    return product;

  };



  // Categories

  const listCategories = () => state.categories;



  const getCategoryById = (id) => state.categories.find((c) => c.id === id);



  const createCategory = (name, description) => {

    const category = {

      id: `cat-${counters.category++}`,

      name,

      description: description || '',

    };

    state.categories.push(category);

    return category;

  };



  const updateCategory = (id, payload) => {

    const existing = getCategoryById(id);

    if (!existing) return null;

    Object.assign(existing, payload);

    return existing;

  };



  const deleteCategory = (id) => {

    const index = state.categories.findIndex((c) => c.id === id);

    if (index === -1) return false;

    state.categories.splice(index, 1);

    return true;

  };



  // Stock & history simulation.

  // No real arithmetic here; we only build user-friendly strings.

  const recordMovement = ({ productId, type, unit, quantity }) => {

    const product = getProductById(productId);



    const movement = {

      id: `move-${counters.movement++}`,

      date: new Date().toLocaleString(),

      type,

      quantity,

      unit,

      baseQuantity: quantity, // placeholder, not a real conversion

      baseUnit: unit,

      reference: 'Simulated',

    };



    movement.quantityDisplay = `${quantity} ${unit} (simulated)`;



    state.stockHistory.unshift(movement);



    if (product) {

      const label = type === 'sale' ? 'Last sale' : 'Last restock';

      product.currentStockDisplay = `${label}: ${quantity} ${unit} (simulated)`;

    }



    return {

      movement,

      product,

    };

  };



  const listHistory = () => state.stockHistory;



  return {

    listShops,

    createShop,

    listProducts,

    getProductById,

    upsertProduct,

    listCategories,

    getCategoryById,

    createCategory,

    updateCategory,

    deleteCategory,

    recordMovement,

    listHistory,

  };

}





