import { FormatPaint } from "@mui/icons-material";
import emailjs from "emailjs-com";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailjs
    .send(
      "service_mjdlnxm",
      "template_46npcqu",
      formData,
      "8MOmvCOn6pIwGnT3t"
    )
    .then(() => {
      alert("Message sent!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    })
    .catch((error) => {
      console.error("Email send error:", error);
      alert("Failed to send message.");
    });
  };

  return (
    <div style={{ 
        padding: "60px 1rem",
        margin: "0 auto",
        maxWidth: "1200px",
        fontFamily: "Helvetica",
        marginBottom: "4rem", }}>

      <h2 style={{ 
        fontSize: "1.5rem", 
        color: "#cd3234",
        marginBottom: "0", }}>
            Contact Us
      </h2>

      <p style={{ 
        marginBottom: "4rem", 
        marginTop: "0",
        fontSize: "3rem",}}>
        We’d love to hear from you! Get in touch.
      </p>
        
      <form onSubmit={handleSubmit} style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "1.2rem",
        maxWidth: "750px",
        width: "100%",
        margin: "0 auto",
        }}>

        <label style={labelStyle}>
          <strong>Name:</strong>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />

        </label>

        <label>
          <strong>E-mail Address:</strong>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          <strong>Subject:</strong>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </label>

        <label>
          <strong>Message:</strong>
          <textarea
            name="message"
            rows={10}
            value={formData.message}
            onChange={handleChange}
            style={{ ...inputStyle, resize: "none" }}
            required
          />
        </label>

        <button type="submit" style={buttonStyle}>
          Send
        </button>

      <footer style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginTop: "3rem", 
        fontSize: "0.7rem", 
        color: "#666",
        }}>

        <div>
          <span role="img" aria-label="location">📍</span> Dumaguete 6200, Philippines
        </div>
        <div style={{ textAlign: "right" }}>
        0955 591 8483<br />
        cafecompassdumaguete@gmail.com
        </div>
      </footer>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #999",
  marginTop: "0.3rem",
  backgroundColor: "transparent",
};

const buttonStyle = {
  padding: "0.7rem 2rem",
  fontSize: "1rem",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  alignSelf: "flex-end",
  backgroundColor: "#cd3234"
};

const labelStyle = {
    width: "100%", 
    display: "flex", 
    flexDirection: "column",
  } as const;

export default ContactUs;
