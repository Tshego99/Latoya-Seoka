<template>
<div id="app">
    <header class="header">
      <nav class="navbar">
        <div class="logo">ChefApp</div>
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link">Home</router-link></li>
          <li><router-link to="/registration" class="nav-link">Register</router-link></li>
          <li><router-link to="/login" class="nav-link">Login</router-link></li>
          <li><router-link to="/dashboard" class="nav-link">Dashboard</router-link></li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default{
  name: 'App'
}

</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

.header {
  background-color: #343a40; /* Dark background for the header */
  color: #ffffff; /* White text color */
  padding: 1rem 2rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #ffffff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background-color: #495057; /* Slightly lighter background on hover */
  color: #f8f9fa; /* Light text color on hover */
}

main {
  padding: 2rem;
}
</style>
