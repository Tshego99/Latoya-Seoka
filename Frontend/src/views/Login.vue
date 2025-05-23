<template>
  <div class="background-wrapper">
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
  </div>
</template>

<style scoped>
.background-wrapper {
  background-image: url("../views/Pork-Rib-Kota-7.jpeg"); /* Adjust if image path differs */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.95); /* Soft white for contrast */
  max-width: 350px;
  width: 100%;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
