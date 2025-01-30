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
    price: 250,
    image: 'products/standard-t-shirt.png',
    options: manWomanSizeOptions,
  },
  {
    id: 'active-t-shirt',
    name: 'Active t-shirt',
    price: 300,
    image: 'products/active-t-shirt.png',
    options: manWomanSizeOptions,
  },
  {
    id: 'crewneck',
    name: 'Crewneck',
    price: 350,
    image: 'products/crewneck.png',
    options: unisexSizeOptions,
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    price: 400,
    image: 'products/hoodie.png',
    options: unisexSizeOptions,
  },
  {
    id: 'flights',
    name: 'Flights, set of three',
    price: 30,
    image: 'products/flights.png',
    options: [],
  },
  // { name: 'Sticker', price: 10, image: 'products/sticker.png' },
]
