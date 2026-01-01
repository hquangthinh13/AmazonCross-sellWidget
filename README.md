# Amazon Video Game Network: Evaluation & Web Demo

This repository contains a comprehensive system for building and evaluating the **Amazon Video Game Network**. It includes the core research environment via Jupyter Notebooks and a full-stack MERN (MongoDB, Express, React, Node.js) application for a live web demonstration.
## 📊 Dataset

The dataset used for both the network evaluation and the web demo is available at the following link:

**Google Drive:**  
https://drive.google.com/drive/folders/10WzeCQ5u9DYmxQtc6UtKCXKE6GTbiBSF

### Dataset Files

* **`meta_Video_Games.jsonl`**  
  Contains product-level information such as game titles, categories, and textual descriptions.

* **`Video_Games.jsonl`**  
  Contains user ratings and interaction history, which are used to construct edges in the video game network.

Download the dataset and place the files in the appropriate directories before running the notebook or starting the backend server.

## 📂 Project Structure

* **/Notebook**: Contains the core research files, including:
  * **`amazon_game_network.ipynb`**: The primary Jupyter Notebook containing the logic for data cleaning, graph construction, network analysis, and performance evaluation.

* **/Frontend**: React (Vite) application using Tailwind CSS, and shadcn/ui.
* **/Backend**: Node.js and Express API using Mongoose to connect to MongoDB.

---

## 🔬 Part 1: Network Evaluation & Research

The core analysis is performed within the Jupyter Notebook. To reproduce the evaluation results:

1. **Environment Setup**: Ensure all Python dependencies are installed and your environment settings (e.g., memory limits) are properly configured.
2. **Run All Cells**: Execute all code cells from top to bottom to initialize components and evaluate the network correctly.
3. **Ablation Study**: A final ablation study was performed to calculate the final score. Refer to internal comments in the notebook to identify specific cells designed for multiple iterations with different configurations.

---

## 🌐 Part 2: Web Demo (MERN Stack)

The web demo allows for real-time interaction with the Amazon Video Game data.

### 🛠 Prerequisites

* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local instance or Atlas URI)

### 🚀 Backend Setup

1. Navigate to the directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your `MONGODB_URI` and `PORT`.
4. Start the server:
```bash
npm run dev  # For development with nodemon
# OR
npm start    # For production

```



### 💻 Frontend Setup

1. Navigate to the directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server:
```bash
npm run dev

```


4. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

---

## 📝 Notes

* **Data Integrity**: Ensure the backend is running and connected to the database before launching the frontend to see the live data.
* **Evaluation Results**: For detailed metrics and scoring logs, refer to the final output blocks generated in the notebook execution.
