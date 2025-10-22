# 🧠 String Analyzer Service — HNG Stage 1 Task

A **RESTful API** that analyzes strings and stores their computed properties, built with **Express.js**, **TypeScript**, and **MongoDB**.

This project was developed as part of the **HNG Stage 1 — Backend Wizards** challenge.

---

## 📘 Project Description (for GitHub & Slack)

This API allows users to analyze any given string and compute various properties such as its length, palindrome status, number of unique characters, word count, SHA-256 hash, and a frequency map of each character.  
It also supports advanced querying, including **filtering by parameters** and **natural language queries**.  
Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, it’s deployed live on **Railway** for public access.

---

## 🚀 Features

For every analyzed string, the API computes and stores:

- ✅ **length** — number of characters  
- ✅ **is_palindrome** — whether the string reads the same backward  
- ✅ **unique_characters** — count of distinct characters  
- ✅ **word_count** — number of words separated by whitespace  
- ✅ **sha256_hash** — SHA-256 hash of the string (used as a unique ID)  
- ✅ **character_frequency_map** — frequency of each character  

---

## 🧩 Tech Stack

- **Node.js** — runtime environment  
- **Express.js** — backend framework  
- **TypeScript** — type safety and scalability  
- **MongoDB + Mongoose** — database and ORM  
- **CORS, Helmet, Express Rate Limit** — security and protection  

---
## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/OrinamiD/hng-stage-1-String-Analyzer-Service.git
cd hng-stage-1-String-Analyzer-Service

npm install
3️⃣ Configure Environment Variables

Create a .env file in the root directory and add:


PORT=7656


MONGODB_URL=mongodb+srv://RinaMyBabyForLife:RinaMyBabyForLife@cluster0.7yfvbbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

4️⃣ Build the Project
npm run build

🧑‍💻 Development Mode

To run the project with live TypeScript compilation and auto-reload:

npm run dev


