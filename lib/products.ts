export type ProductCategory = "pastel" | "drink" | "combo"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  hero: string
  image?: string
  comboConfig?: {
    pasteis: number
    drinks: number
  }
}

export const products: Product[] = [
  // Pastéis
  {
    id: "pastel-superman",
    name: "Superman",
    description: "Frango com catupiry, ervilha e milho",
    price: 12.0,
    category: "pastel",
    hero: "Superman",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9c039a1b-3620-428c-93f7-fa03f0baca3e-IKRVfjU0wqQJJmZAeqysVbcd4ZkJLJ.jpg",
  },
  {
    id: "pastel-flash",
    name: "Flash",
    description: "Queijo mussarela",
    price: 12.0,
    category: "pastel",
    hero: "Flash",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8d6fc060-bb9c-4bd1-93eb-4927f64fe5c0-0Br1KchIZeAL4oCpCjFemfOAaht24c.jpg",
  },
  {
    id: "pastel-batman",
    name: "Batman",
    description: "Carne, azeitona e cebolinha",
    price: 12.0,
    category: "pastel",
    hero: "Batman",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f47750d3-1399-40a1-aa9e-010ac0ba6a52-kYbuau3KR5aHwrIJ0TTKyqzh3uqJMX.jpg",
  },
  {
    id: "pastel-mulher-maravilha",
    name: "Mulher Maravilha",
    description: "Pizza: queijo, presunto, orégano e tomate",
    price: 12.0,
    category: "pastel",
    hero: "Mulher Maravilha",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f3e64817-ee3c-4032-b289-9ad7c9b61d08-ogOH2oAl4MR4TPDA2kWEiA7yIqNQq5.jpg",
  },
  // Drinks
  {
  id: "drink-arlequina",
  name: "Arlequina",
  description: "Morango(morango/xarope), refrigerante e leite condensado",
  price: 10.0,
  category: "drink",
  hero: "Arlequina",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ddc8da13-f7d8-4d61-b4cb-0235d4ab9582-1PJvfXSUCVhHLmByvIEy9wXRsgxR8u.jpg",
},
{
  id: "drink-aquaman",
  name: "Aquaman",
  description: "Maracujá (maracujá/xarope), refrigerante e leite condensado",
  price: 10.0,
  category: "drink",
  hero: "Aquaman",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2f660366-9efc-4483-a7dd-832eaa4f5cdb-waIRSISuoBCibKcebGvvxnEW0bZMjN.jpg",
},
{
  id: "drink-lanterna-verde",
  name: "Lanterna Verde",
  description: "Limão (limão/xarope), refrigerante, leite condensado e um toque de hortelã",
  price: 10.0,
  category: "drink",
  hero: "Lanterna Verde",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/87d26151-0e96-4422-b4ea-7f76e33b6284-PUhNtRsW8Uez8FDULOn9AMdNtga15o.jpg",
},
   // Combos
  {
    id: "combo-mulher-gato",
    name: "Combo Mulher-Gato",
    description: "1 Pastel + 1 Drink – Sedutor e cheio de sabor escondido",
    price: 20.0,
    category: "combo",
    hero: "Mulher-Gato",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f67542c8-4c2a-4306-afe8-f303cd27ef70-xsg249dKzpbLywuyhyyhcMEagmGPDA.jpg",
    comboConfig: {
      pasteis: 1,
      drinks: 1,
    },
  },
  {
    id: "combo-coringa",
    name: "Combo Coringa",
    description: "2 Pastéis + 2 Drinks – Surpreendente, caótico e impossível de prever",
    price: 40.0,
    category: "combo",
    hero: "Coringa",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ab1b5e85-2443-41c9-91dc-9657850beb19-q9ACeuRlFOIuwDYTY25vfvuBOW87nD.jpg",
    comboConfig: {
      pasteis: 2,
      drinks: 2,
    },
  },
  {
    id: "combo-darkseid",
    name: "Combo Darkseid",
    description: "3 Pastéis + 2 Drinks – O mais poderoso de todos, só para os fortes",
    price: 50.0,
    category: "combo",
    hero: "Darkseid",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2c072df6-d9b9-47bc-b9c7-baf044db110b-TcOYHjrTVz60Uxz5fxnyiMz5LBm0Qz.jpg",
    comboConfig: {
      pasteis: 3,
      drinks: 2,
    },
  },
]

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((p) => p.category === category)
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}
