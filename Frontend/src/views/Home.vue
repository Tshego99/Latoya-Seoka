<template>
    <div class="home-container">
    <h1>Welcome to ChefApp!</h1>

    <div class="background">
      <div class="contact-us">
        <h2>Contact Us</h2>
        <p>If you have any questions, feel free to reach out to us!</p>
        <div class="contact-details">
          <p><strong>Email:</strong> support@chefapp.com</p>
          <p><strong>Phone:</strong> +27 81 854 6502</p>
          <p><strong>Address:</strong> 123 KotaChef Street, Klipfontein, FC 12345</p>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
  }
  </script>
  
  <style scoped>
.home-container {
  position: relative;
}

h1 {
  font-size: 3rem;
  color: #08150e;
  text-align: center;
  margin: 0;
  padding: 20px 0;
  background-color: rgba(11, 11, 11, 0.8);
  width: 100%;
  position: relative;
  margin-top: 60px; /* Offset to prevent overlap with navbar */
  z-index: 1;
}

/* Background Image Styling */
.background {
  background-image: url('../assets/background img.JPG');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 100px;
}


.contact-us {
  background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 20%; 
  right: 5%;
  width: 300px;
  text-align: left;
}

.contact-us h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.contact-details p {
  margin: 5px 0;
}
</style>
  