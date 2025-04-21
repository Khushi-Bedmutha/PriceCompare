// src/utils/productActions.js
import { getData, storeData } from './storage';

export const addToFavorites = async (product) => {
  const favs = await getData('favorites');
  const exists = favs.find(item => item.product_id === product.product_id);
  if (!exists) {
    const updated = [...favs, product];
    await storeData('favorites', updated);
  }
};

export const addToCart = async (product) => {
  const cart = await getData('cart');
  const updated = [...cart, product];
  await storeData('cart', updated);
};
