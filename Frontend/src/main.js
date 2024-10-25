import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'; // Import Pinia only once
import router from './router'; // Import Vue Router

const app = createApp(App); // Create the Vue app instance

const pinia = createPinia(); // Create the Pinia instance for state management

app.use(pinia); // Register Pinia with the Vue app for state management
app.use(router); // Register Vue Router for handling routes

app.mount('#app'); // Mount the app to the DOM
