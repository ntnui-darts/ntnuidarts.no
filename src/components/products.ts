import { manWomanSizeOptions, unisexSizeOptions } from './sizeOptions'

export type Product = {
  id: string
  name: string
  price: number
  image: string
  options: readonly { text: string; value: string }[]
}

export type ProductWithOption = Product & {
  option: { text: string; value: string | null }
}

export type ProductInCart = {
  id: string
  name: string
  option: string | null
  count: number
  price: number
}

export const productsRaw = [
  {
    id: 'standard-t-shirt',
    name: 'Standard t-shirt',
    price: 275,
    image: 'products/standard-t-shirt.png',
    options: manWomanSizeOptions,
  },
  {
    id: 'active-t-shirt',
    name: 'Active t-shirt',
    price: 350,
    image: 'products/active-t-shirt.png',
    options: manWomanSizeOptions.filter(
      (o) => o.value != 'woman-xs' && o.value != 'man-xs'
    ),
  },
  {
    id: 'crewneck',
    name: 'Crewneck',
    price: 400,
    image: 'products/crewneck.png',
    options: unisexSizeOptions,
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    price: 450,
    image: 'products/hoodie.png',
    options: unisexSizeOptions,
  },
  {
    id: 'flights',
    name: 'Flights, set of three',
    price: 35,
    image: 'products/flights.png',
    options: [],
  },
  {
    id: 'sticker',
    name: 'Sticker',
    price: 10,
    image: 'products/sticker.png',
    options: [],
  },
]
