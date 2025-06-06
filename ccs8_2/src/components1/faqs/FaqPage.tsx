import React from "react";
import BreadcrumbsComponent from "../navbar/BreadcrumbsComponent";

const faqs = [
  {
    question: "FAQ #1: What is the purpose of this website?",
    answer:
      "Our website is designed to help coffee lovers and casual cafe-goers easily discover and explore cafes that match their unique preferences. Whether you're looking for a quiet study spot, a lively brunch place, or a cozy corner to unwind, we aim to make cafe-hopping more accessible, enjoyable, and personalized for every user.",
  },
  {
    question: "FAQ #2: How do I search for cafes near me?",
    answer:
      "Searching for cafes near you is quick and simple. Just use the search bar located at the top of the Home page. Enter keywords like the type of cafe you're looking for, or even pick from the available tags. Our search will instantly suggest cafes that best fit your criteria, helping you find the perfect spot in seconds.",
  },
  {
    question: "FAQ #3: Can I filter cafes by type?",
    answer:
      "Yes! After searching, you can apply filters like ambiance, Wi-Fi availability, pet-friendliness, and more. Our filters make it easy to find exactly the type of cafe experience you're looking for without having to scroll endlessly.",
  },
  {
    question: "FAQ #4: How often is the cafe information updated?",
    answer:
      "We strive to keep all cafe listings accurate and up-to-date. Our team reviews and updates listings on a monthly basis. However, since changes can happen suddenly, we also recommend checking the cafe’s official social media for real-time updates before your visit.",
  },
  {
    question: "FAQ #5: How can I contact you if I have a suggestion or encounter a problem",
    answer:
      "We love discovering new places as well as hearing your feedback, you can reach us by visiting the 'Contact Us' page. Simply fill out the form with any information you can provide. Our team will review your suggestion and feedback and work on it as soon as possible.",
  },
  {
    question: "FAQ #6: Do you have recommendations for specialty coffee drinks?",
    answer:
      "Yes! We know that finding the perfect drink can make a cafe visit even better. Visit our “Coffee Flavor Profiles” page where we feature curated suggestions for drinks based on flavor preferences like bitter, sweet, fruity, nutty, and creamy. You'll find ideas tailored to your taste buds.",
  },
  {
    question: "FAQ #7: What kind of information do you provide about each cafe?",
    answer:
      "Each cafe listing includes photos, location, operating hours, price range, menu items, and tags (pet-friendly, cozy, Wi-Fi availability). This way, you know exactly what to expect before you arrive.",
  },
  {
    question: "FAQ #8: What does the Map View feature do?",
    answer:
      "The Map View offers a visual and interactive experience where you can see all listed cafes plotted directly on a map. You can zoom in on your area and explore cafes nearby. This feature is especially useful if you're planning a cafe-hopping day or simply want to find the closest coffee shop quickly while on the go.",
  },
];

const FaqPage = () => {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'FAQ' },
    ];
  return (
    <div style={{ 
        padding: "60px 1rem",
        margin: "0 auto",
        maxWidth: "1200px",
        fontFamily: "Helvetica",
        marginBottom: "4rem",
     }}>
        <BreadcrumbsComponent items={breadcrumbItems} />
      <h1 style={{ 
        fontSize: "1.5rem", 
        color: "#cd3234", 
        marginBottom: "0", }}>
        Frequently Asked Questions
      </h1>

      <p style={{
        marginBottom: "4rem", 
        marginTop: "0",
        fontSize: "3rem",
      }}>
        Quick answers to common questions.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              padding: "1.5rem",
              paddingTop: "1rem",
              border: "1px solid #110203",
            }}
          >
            <h3
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                backgroundColor: "transparent",
                color: "#cd3234",
              }}
            >
              {faq.question}
            </h3>
            <p
              style={{
                fontSize: "14px",
                textAlign: "justify",
                backgroundColor: "transparent",
              }}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
