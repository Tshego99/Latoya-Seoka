<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter(); // Initialize the router
const username = ref('')
const password = ref('')
const email = ref('')
const confirmPassword = ref('') // Corrected the variable name

const message = ref(''); // Message for feedback

const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:3000/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    
    // Show success message
    alert('Registration successful');
    
    // Redirect to login page
    router.push('/login');
  } catch (error) {
    // Improved error handling
    if (error.response) {
      // Server responded with a status other than 200
      alert(`Registration failed: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response was received
      alert('Registration failed: No response from server');
    } else {
      // Something else caused the error
      alert(`Registration failed: ${error.message}`);
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
p {
  text-align: center;
  color: red;
  margin-top: 15px;
}
</style>
