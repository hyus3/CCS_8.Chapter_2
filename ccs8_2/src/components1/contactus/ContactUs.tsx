import { FormatPaint } from "@mui/icons-material";
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
    // Placeholder for form submission logic
    alert("Message sent!");
    setFormData({ 
        name: "", 
        email: "", 
        subject: "", 
        message: "" });
  };

  return (
    <div style={{ 
        padding: "2rem", 
        maxWidth: "900px", 
        margin: "0 auto", 
        fontFamily: "Helvetica",}}>

      <h2 style={{ 
        fontSize: "1.5rem", 
        color: "#cd3234",
        marginBottom: "0",
        marginLeft: "-10rem", }}>
            Contact Us
      </h2>

      <p style={{ 
        marginBottom: "4rem", 
        marginTop: "0",
        fontSize: "3rem",
        marginLeft: "-10rem", }}>
        We’d love to hear from you! Get in touch.
      </p>

      <form onSubmit={handleSubmit} style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "1.2rem" }}>

        <label>
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
      </form>

      <footer style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem", fontSize: "0.9rem", color: "#666" }}>
        <div>
          <span role="img" aria-label="location">📍</span> Silliman University, Dumaguete 6200 <br />
          Negros Oriental, Philippines
        </div>
        <div style={{ textAlign: "right" }}>
          09XX XXXX XXXX<br />
          emailaddress@gmail.com
        </div>
      </footer>
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

export default ContactUs;
