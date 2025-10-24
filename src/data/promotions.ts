import { Promotion } from "../types";

export const promotions: Promotion[] = [
  {
    id: "promo1",
    title: "2x1 en Pizzas Clásicas",
    description: "Lleva 2 pizzas clásicas por el precio de 1. Válido de lunes a miércoles.",
    image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "50%",
    validUntil: "2024-12-31",
    isActive: true,
  },
  {
    id: "promo2",
    title: "Combo Familiar",
    description: "2 pizzas grandes + 4 bebidas + 2 postres por solo $39.99",
    image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "$20%",
    validUntil: "2024-12-31",
    isActive: true,
  },
  {
    id: "promo3",
    title: "Pizza + Bebida",
    description: "Cualquier pizza mediana + bebida por solo $14.99",
    image: "https://images.pexels.com/photos/7813232/pexels-photo-7813232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "$10%",
    validUntil: "2024-12-31",
    isActive: true,
  },
  {
    id: "promo4",
    title: "Descuento Estudiantes",
    description: "20% de descuento para estudiantes con credencial válida",
    image: "https://images.pexels.com/photos/4553111/pexels-photo-4553111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "20%",
    validUntil: "2024-12-31",
    isActive: true,
  },
];
