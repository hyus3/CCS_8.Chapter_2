import React from "react";
import "./CoffeeProfiles.css";
import BreadcrumbsComponent from "../navbar/BreadcrumbsComponent";

type CoffeeItem = {
  name: string;
  image: string;
  description: string;
};

type CoffeeCategory = {
  title: string;
  items: CoffeeItem[];
};

const coffeeData: CoffeeCategory[] = [
  {
    title: "Strong, dark, bold flavors",
    items: [
      {
        name: "Americano",
        image: "americano.jpeg",
        description: "Smooth and bold, an espresso diluted with hot water for a milder intensity.",
      },
      {
        name: "Espresso",
        image: "espresso.jpg",
        description: "A concentrated shot of pure espresso flavor, rich, thick, and intense.",
      },
      {
        name: "Long Black",
        image: "longblack.jpg",
        description: "Hot water first, then espresso — preserving the crema and giving a bold, aromatic cup.",
      },
      {
        name: "Cold Brew",
        image: "coldbrew.jpg",
        description: "Coffee steeped cold for hours; smooth, bold, and less acidic than regular iced coffee.",
      },
    ],
  },
  {
    title: "Velvety, smooth, milky",
    items: [
      {
        name: "Spanish Latte",
        image: "spanishlatte.jpeg",
        description: "A sweeter twist on the latte with condensed milk and a silky, creamy finish.",
      },
      {
        name: "Cappuccino",
        image: "capuccino.jpeg",
        description: "Balanced espresso, steamed milk, and a thick layer of foam — rich yet airy.",
      },
      {
        name: "Macchiato",
        image: "macchiato.jpg",
        description: 'Espresso "stained" with a dollop of milk foam, bold with a hint of creaminess.',
      },
      {
        name: "Cafe Latte",
        image: "cafelatte.jpg",
        description: "Mild and creamy espresso-based drink with more steamed milk and light foam.",
      },
    ],
  },
  {
    title: "Sweet, creamy, and dessert-like",
    items: [
      {
        name: "Mocha",
        image: "mocha.jpg",
        description: "Chocolate and espresso combined, topped with milk — like a coffee-flavored hot cocoa.",
      },
      {
        name: "Vanilla Latte",
        image: "vanillalatte.jpg",
        description: "Espresso blended with steamed milk and sweet vanilla syrup for a soft, comforting flavor.",
      },
      {
        name: "Caramel Latte",
        image: "caramellatte.jpg",
        description: "Smooth espresso with rich caramel syrup and velvety milk for a buttery sweetness.",
      },
      {
        name: "White Chocolate Mocha",
        image: "whitechocolatemocha.jpg",
        description: "A creamier, sweeter version of mocha using white chocolate.",
      },
    ],
  },
  {
    title: "Nutty, earthy, and rich",
    items: [
      {
        name: "Matcha Latte",
        image: "matchalatte.jpg",
        description: "Creamy and vibrant green tea mixed with steamed milk for a smooth, earthy taste.",
      },
      
      {
        name: "Pistachio Latte",
        image: "pistachiolatte.jpg",
        description: "Sweet pistachio flavor mixed with espresso and milk, creamy and nutty.",
      },
      {
        name: "Pecan Latte",
        image: "pecanlatte.jpg",
        description: "Coffee and pecan flavors blend into a cozy, nutty dessert drink.",
      },
      {
        name: "Almond Milk",
        image: "almondmilk.jpg",
        description: "Coffee paired with almond milk, offering a light, nutty, dairy-free option.",
      },
    ],
  },
];

const CoffeeProfiles = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Coffee Profiles' },
  ];
  return (
    <div className="container">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <h2 className="title" >
        Coffee Flavors Profile
      </h2>

      <p className="subtitle">
        Discover your perfect cup.
      </p>
        
      {coffeeData.map((category) => (

<div key={category.title} style={{ 
    marginBottom: "4rem", }}>
  
  <h2 style={{ 
    marginBottom: "1rem",
    fontSize: "1.5rem",
    fontWeight: "normal",
    color: "#6e4e33", }}>
    {category.title}
  </h2>

  <div className="grid">

    {category.items.map((item) => (
      <div
        key={item.name} className="card-coffee">

        <div
          style={{ 
            position: "relative", 
            height: '200px',
            overflow: "hidden" }}
          onMouseEnter={(e) =>
            ((e.currentTarget.querySelector(".hover-overlay") as HTMLElement).style.opacity = "1")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget.querySelector(".hover-overlay") as HTMLElement).style.opacity = "0")
          } >

          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }} />

          <div
            className="hover-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              opacity: 0,
              transition: "opacity 0.3s ease",
            }} >
            
            <span style={{ 
                maxWidth: "90%",
                backgroundColor: "transparent",
                wordWrap: "break-word",
                fontSize: "0.8rem",
             }} > 
             {item.description} 
             </span>
             
          </div>
        </div>
        
        <div style={{
            padding: "10px", 
            textAlign: "center", 
            backgroundColor: "#cd3234",
            color: "#ffffff", }}>
          {item.name}
        </div>

      </div>
    ))}
  </div>
</div>
))}
</div>
);
};

export default CoffeeProfiles;