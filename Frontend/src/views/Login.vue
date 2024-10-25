<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </form>
    <div class="forgot-password">
      <a href="#" @click.prevent="forgotPassword">Forgot your password?</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('')
const password = ref('')
const errorMessage = ref('') // Ref to store error messages

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: username.value,
      password: password.value,
    });

    // Assuming the token is returned in response.data.token
    localStorage.setItem('token', response.data.token);
    alert('Login successful');
    
    // Redirect to a protected route(Dashboard)
    router.push('/dashboard');
  } catch (error) {
    // Improved error handling
    if (error.response) {
      // Server responded with a status other than 200
      errorMessage.value = error.response.data.message || 'Login failed';
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage.value = 'Login failed: No response from server';
    } else {
      // Something else caused the error
      errorMessage.value = `Login failed: ${error.message}`;
    }
  }
}

const forgotPassword = () => {
  // Handle forgot password logic
  alert('Forgot password feature is not implemented yet.');
}
</script>

<style scoped>
.login-container {
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
.forgot-password {
  margin-top: 10px;
  text-align: center;
}
.forgot-password a {
  color: #007bff;
  text-decoration: none;
}
.forgot-password a:hover {
  text-decoration: underline;
}
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
