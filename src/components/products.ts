import { manWomanSizeOptions, unisexSizeOptions } from './sizeOptions'

export type Product = {
  id: string
  name: string
  price: number
  image: string
  options: { text: string; value: string }[]
}

export type ProductWithOption = Product & {
  option: { text: string; value: string } | null
}

export type ProductInCart = {
  id: string
  option: { text: string; value: string } | null
  count: number
}

export const productsRaw = [
  {
    id: 'standard-t-shirt',
    name: 'Standard t-shirt',
    price: 214,
    image: 'products/standard-t-shirt.png',
    options: manWomanSizeOptions,
  },
  {
    id: 'active-t-shirt',
    name: 'Active t-shirt',
    price: 289,
    image: 'products/active-t-shirt.png',
    options: manWomanSizeOptions,
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    price: 379,
    image: 'products/hoodie.png',
    options: unisexSizeOptions,
  },
  {
    id: 'crewneck',
    name: 'Crewneck',
    price: 329,
    image: 'products/crewneck.png',
    options: unisexSizeOptions,
  },
  {
    id: 'flights',
    name: 'Flights, set of three',
    price: -1,
    image: 'products/flights.png',
    options: [],
  },
  // { name: 'Sticker', price: 10, image: 'products/sticker.png' },
]
