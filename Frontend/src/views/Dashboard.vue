<template>
  <div class="dashboard-container">
    <h2 class="menu-title">KOTA MENU</h2>

    <!-- List of food items -->
    <ul class="food-list">
      <li v-for="item in foodItems" :key="item.id" :class="item.colorClass" class="food-item">
        <h3 class="food-name">{{ item.name }}</h3>
        <p class="food-details">Price: R{{ item.price.toFixed(2) }}</p>
        <p class="food-ingredients">
          <strong>Ingredients:</strong> {{ item.ingredients.join(', ') }}
        </p>
        <div class="item-actions">
          <button @click="editItem(item)" class="edit-button">Edit</button>
          <button @click="deleteItem(item.id)" class="delete-button">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Form to add a new or edit an existing food item -->
    <form @submit.prevent="handleSubmit">
      <h3 v-if="isEditMode">Edit Food Item</h3>
      <h3 v-else>Add New Food Item</h3>
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" v-model="newItem.name" placeholder="Enter name" required />
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input id="price" v-model.number="newItem.price" type="number" step="0.01" placeholder="Enter price" required />
      </div>
      <div class="form-group">
        <label for="ingredients">Ingredients (comma separated):</label>
        <input id="ingredients" v-model="newItem.ingredients" placeholder="Enter ingredients" required />
      </div>
      <button type="submit" class="submit-button">{{ isEditMode ? 'Update Item' : 'Add Item' }}</button>
      <button v-if="isEditMode" @click="cancelEdit" class="cancel-button">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useFoodItemStore } from '../store/foodItemStore';

const store = useFoodItemStore();
const foodItems = ref([]);
const newItem = ref({ id: null, name: '', price: 0, ingredients: '' });
const isEditMode = ref(false);

// Fetch food items from the backend using Axios
const fetchItems = async () => {
  try {
    const response = await axios.get('http://localhost:3000/foodItems');
    foodItems.value = response.data;
  } catch (error) {
    // Log the full error object for debugging
    console.error('Error fetching food items:', {
      message: error.message,
      name: error.name,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      } : null,
      request: error.request,
    });
    // Fallback to static data if the API is unavailable
    foodItems.value = [
      { id: 1, name: 'Chicken Kota', price: 15.00, ingredients: ['Quarter Loaf', 'Fries', 'Chicken'], colorClass: 'chicken-kota' },
      { id: 2, name: 'Beef Kota', price: 20.00, ingredients: ['Quarter Loaf', 'Fries', 'Beef'], colorClass: 'beef-kota' },
      { id: 3, name: 'Veggie Kota', price: 12.00, ingredients: ['Quarter Loaf', 'Fries', 'Veggies'], colorClass: 'veggie-kota' },
    ];
  }
};


// Handle form submission
const handleSubmit = () => {
  if (isEditMode.value) {
    updateItem();
  } else {
    addItem();
  }
  resetForm();
};

// Add new food item
const addItem = () => {
  const ingredientsArray = newItem.value.ingredients.split(',').map(ing => ing.trim());
  axios.post('http://localhost:3000/foodItems', {
    name: newItem.value.name,
    price: newItem.value.price,
    ingredients: ingredientsArray,
  })
  .then(response => {
    foodItems.value.push({ ...response.data, colorClass: determineColorClass(newItem.value.name) });
  })
  .catch(error => {
    console.error('Error adding food item:', error);
  });
};

// Edit an existing food item
const editItem = (item) => {
  newItem.value = { ...item, ingredients: item.ingredients.join(', ') };
  isEditMode.value = true;
};

// Update the item after editing
const updateItem = () => {
  const index = foodItems.value.findIndex(item => item.id === newItem.value.id);
  const updatedItem = {
    ...newItem.value,
    ingredients: newItem.value.ingredients.split(',').map(ing => ing.trim()),
    colorClass: determineColorClass(newItem.value.name),
  };
  if (index !== -1) {
    axios.put(`http://localhost:3000/foodItems/${updatedItem.id}`, updatedItem)
      .then(() => {
        foodItems.value.splice(index, 1, updatedItem);
        isEditMode.value = false;
      })
      .catch(error => {
        console.error('Error updating food item:', error);
      });
  }
};

// Delete a food item
const deleteItem = (id) => {
  axios.delete(`http://localhost:3000/foodItems/${id}`)
    .then(() => {
      foodItems.value = foodItems.value.filter(item => item.id !== id);
    })
    .catch(error => {
      console.error('Error deleting food item:', error);
    });
};

// Cancel edit mode and reset form
const cancelEdit = () => {
  resetForm();
};

// Reset form data
const resetForm = () => {
  newItem.value = { id: null, name: '', price: 0, ingredients: '' };
  isEditMode.value = false;
};

// Determine the color class based on item name
const determineColorClass = (name) => {
  if (name.toLowerCase().includes('chicken')) {
    return 'chicken-kota';
  } else if (name.toLowerCase().includes('beef')) {
    return 'beef-kota';
  } else if (name.toLowerCase().includes('veggie')) {
    return 'veggie-kota';
  } else {
    return '';
  }
};

// Fetch food items when the component is mounted
onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.dashboard-container {
  margin: 0 auto;
  padding: 4rem;
  max-width: 700px;
  background-color: #f3f3f3;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
  text-transform: uppercase;
  font-weight: bold;
}

.food-list {
  list-style-type: none;
  padding: 0;
}

.food-item {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.food-name {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.food-details {
  font-size: 1.2rem;
  color: #060101;
}

.food-ingredients {
  font-size: 1.1rem;
  margin-top: 0.5rem;
  color: #0f0303;
}

.item-actions {
  margin-top: 1rem;
}

.edit-button,
.delete-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;
}

.delete-button {
  background-color: #f44336;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button:hover {
  background-color: #e41e1e;
}

form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 1.2rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

form input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button,
.cancel-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;
}

.cancel-button {
  background-color: #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  border-radius:4px;
}
</style>

