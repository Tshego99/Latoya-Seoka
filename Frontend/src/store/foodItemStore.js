import { defineStore } from 'pinia'
import axios from 'axios'

export const useFoodItemStore = defineStore('foodItems', {
  state: () => ({
    foodItems: [],
    error: null, // Error state
  }),
  actions: {
    async fetchFoodItems() {
      try {
        const response = await axios.get('http://localhost:3000/foodItems', {
          // Remove Authorization headers if not needed
          // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.foodItems = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching food items:', error)
        this.error = 'Failed to fetch food items.'
      }
    },
    async addFoodItem(name, price, ingredients) {
      try {
        await axios.post('http://localhost:3000/foodItems', { name, price, ingredients }, {
          // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        await this.fetchFoodItems()
        this.error = null
      } catch (error) {
        console.error('Error adding food item:', error)
        this.error = 'Failed to add food item.'
      }
    },
    async updateFoodItem(id, name, price, ingredients) {
      try {
        await axios.put(`http://localhost:3000/foodItems/${id}`, { name, price, ingredients }, {
          // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        await this.fetchFoodItems()
        this.error = null
      } catch (error) {
        console.error('Error updating food item:', error)
        this.error = 'Failed to update food item.'
      }
    },
    async deleteFoodItem(id) {
      try {
        await axios.delete(`http://localhost:3000/foodItems/${id}`, {
          // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        await this.fetchFoodItems()
        this.error = null
      } catch (error) {
        console.error('Error deleting food item:', error)
        this.error = 'Failed to delete food item.'
      }
    },
    clearError() {
      this.error = null
    },
  },
})
