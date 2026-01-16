import wheel4_1 from '../assets/4wheel1.jpg';
import wheel4_2 from '../assets/4wheel2.jpeg';
import wheel4_3 from '../assets/4wheel3.webp';
import wheel6 from '../assets/6wheel.jpg';
import wheel10 from '../assets/10wheel.webp';

export const vehicleData = [
  {
    name: "Tata Ace",
    capacity: "1 Ton",
    wheels: 4,
    rent: 8, // ₹8 per km
    img: wheel4_1,
    details: "Best for small scale cargo, city transport."
  },
  {
    name: "Mahindra Pickup",
    capacity: "2 Tons",
    wheels: 4,
    rent: 10, // ₹10 per km
    img: wheel4_2,
    details: "Ideal for delicate goods, household items."
  },
  {
    name: "Eicher 4 Wheel",
    capacity: "3 Tons",
    wheels: 4,
    rent: 12, // ₹12 per km
    img: wheel4_3,
    details: "Good for medium weight cargo."
  },
  {
    name: "Eicher 6 Wheel",
    capacity: "8 Tons",
    wheels: 6,
    rent: 18, // ₹18 per km
    img: wheel6,
    details: "Long distance heavy transport."
  },
  {
    name: "Eicher 10 Wheel",
    capacity: "12 Tons",
    wheels: 10,
    rent: 25, // ₹25 per km
    img: wheel10,
    details: "Industrial and bulk cargo."
  }
];
