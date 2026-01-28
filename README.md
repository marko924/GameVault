# Video Game Store Application - GameVault

A full-stack web application for buying and managing video games, built with Angular, Node.js, Express, and ArangoDB.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- ArangoDB
- Angular CLI

### Installation & Running

1. **Start ArangoDB**
   ```bash
   # Start your ArangoDB instance
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   node app.js
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm install
   ng serve
   ```

The application will be available at `http://localhost:4200`

## ✨ Features

- **User Authentication** - Login and registration system
- **Game Recommendations** - Personalized suggestions based on purchase history
- **Game Filtering** - Browse games with advanced filtering options
- **Detailed Game View** - View comprehensive information about each game
- **Purchase System** - Buy games from available stores
- **Purchase History** - View all previously purchased games

## 🛠️ Technology Stack

### Backend
- **Node.js & Express** - Provides a simple and efficient REST API that connects the Angular frontend with the ArangoDB database

### Frontend
- **Angular** - Modern web framework for building the user interface
- **Angular Material** - Material Design components for a polished UI

### Database
- **ArangoDB** - Multi-model database supporting both document and graph data

## 📊 Database Schema

### Document Collections

- **igrice** (games) - Stores game information
- **korisnici** (users) - Stores user account data
- **radnje** (stores) - Stores shop/retailer information

### Edge Collections

#### dostupno_u (available_in)
- **Connection**: Game → Store
- **Attributes**:
  - `kolicina` (quantity) - Number of copies available in the store; used for purchase validation and inventory management

#### kupio (purchased)
- **Connection**: User → Game
- **Attributes**:
  - `datum_kupovine` (purchase_date) - Enables chronological display of purchase history
  - `radnja` (store) - Identifies which store was selected during purchase; used to decrement inventory and display purchase location in history

#### slicna_sa (similar_to)
- **Connection**: Game → Game
- **Attributes**:
  - `stepen_slicnosti` (similarity_degree) - Degree of similarity between games; used to generate personalized recommendations based on user's purchase patterns

## 📁 Frontend Components

- **igrice.ts** - Displays all available games to the user
- **igrica-detalji.ts** - Shows detailed information for a selected game and provides purchase functionality
- **kupljene.ts** - Displays the user's purchase history
- **preporuke.ts** - Shows game recommendations based on the user's purchase patterns

## 💾 Data Import

Database collections are populated using JSON scripts created based on the schema definitions. These scripts can be imported directly into ArangoDB for each collection.

## 📝 License

This project is available for educational purposes.

---

**Note**: Make sure ArangoDB is properly configured and running before starting the backend server.