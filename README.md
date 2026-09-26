# 🧠 MindPredict — Mental Health Score Predictor

MindPredict is a web-based **Mental Health Score Prediction** application that uses a Machine Learning model to predict a student's mental health score based on academic habits, social media usage, lifestyle, sleep, physical activity, and stress level.

The project consists of a **FastAPI backend**, a trained **Machine Learning model**, and a responsive **HTML, CSS, and JavaScript frontend**.

## 🌐 Live Deployment

The backend is deployed on **Render** and is publicly accessible at:

[MindPredict API — Render](https://mental-health-score-8.onrender.com?utm_source=chatgpt.com)

### API Base URL

```text
https://mental-health-score-8.onrender.com
```

### API Documentation

FastAPI automatically provides interactive API documentation.

**Swagger UI:**

```text
https://mental-health-score-8.onrender.com/docs
```

**ReDoc:**

```text
https://mental-health-score-8.onrender.com/redoc
```

---

## 🚀 Features

* 🧠 Machine Learning-based mental health score prediction
* ⚡ FastAPI backend
* 🌐 Interactive web frontend
* ☁️ Backend deployed on Render
* 📊 Prediction score displayed dynamically
* 📱 Responsive design
* ✅ Input validation
* 🔄 Real-time API communication using Fetch API
* ⏳ Loading state during prediction
* ❌ Error handling
* 🎨 Modern and user-friendly interface

---

## 🏗️ Project Architecture

```text
MindPredict
│
├── Backend
│   ├── main.py
│   └── Mental_Health_Model.pkl
│
├── Frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

### Backend

* Python
* FastAPI
* Pydantic
* Pandas
* Joblib
* Uvicorn

### Machine Learning

* Pre-trained Machine Learning model
* Model stored as `Mental_Health_Model.pkl`

### Deployment

* Render

---

## 🔌 API

### Base URL

```text
https://mental-health-score-8.onrender.com
```

### Health Check

```http
GET /
```

Example:

```json
{
    "message": "Welcome baby"
}
```

### Prediction

```http
POST /predict
```

---

## 📤 Prediction Request

```json
{
    "age": 21,
    "gender": "Male",
    "country": "India",
    "academic_level": "Undergraduate",
    "most_used_platform": "Instagram",
    "purpose_of_use": "Entertainment",
    "avg_daily_usage_hours": 5.5,
    "daily_unlocks": 85,
    "study_hours": 4,
    "physical_activity_hours": 1.5,
    "sleep_hours_per_night": 7,
    "stress_level": "Medium"
}
```

---

## 📥 Prediction Response

```json
{
    "predicted_mental_health_score": 78.45
}
```

---

## 🌐 Frontend → Backend

During local development, the frontend can communicate with:

```text
http://127.0.0.1:8000/predict
```

For the deployed application, use:

```text
https://mental-health-score-8.onrender.com/predict
```

Example JavaScript:

```javascript
const API_URL = "https://mental-health-score-8.onrender.com";

const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
});

const result = await response.json();
```

This allows the frontend to send the user's data to the deployed FastAPI backend and receive the predicted mental health score.

---

## 📋 Input Parameters

| Parameter                 | Description                                   |
| ------------------------- | --------------------------------------------- |
| Age                       | User's age                                    |
| Gender                    | Male / Female                                 |
| Country                   | User's country                                |
| Academic Level            | Undergraduate / Graduate / High School        |
| Most Used Platform        | Frequently used social media platform         |
| Purpose of Use            | Networking / Education / Entertainment / News |
| Average Daily Usage Hours | Average daily social media usage              |
| Daily Unlocks             | Number of daily device unlocks                |
| Study Hours               | Daily study hours                             |
| Physical Activity Hours   | Daily physical activity                       |
| Sleep Hours Per Night     | Average sleeping hours                        |
| Stress Level              | Low / Medium / High / Very High               |

---

## 🧠 Machine Learning Workflow

```text
              User
                │
                ▼
        ┌───────────────┐
        │ Frontend Form │
        └───────┬───────┘
                │
                ▼
        Input Validation
                │
                ▼
        ┌───────────────┐
        │ FastAPI API   │
        └───────┬───────┘
                │
                ▼
       Data Preparation
                │
                ▼
     ┌────────────────────┐
     │ Machine Learning   │
     │       Model        │
     └─────────┬──────────┘
               │
               ▼
      Mental Health Score
               │
               ▼
        Frontend Result
```

---

## ⚙️ Local Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MindPredict
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn pandas joblib
```

Run the backend:

```bash
uvicorn main:app --reload
```

Local API:

```text
http://127.0.0.1:8000
```

---

## 📖 API Documentation

Once the backend is running, open:

```text
http://127.0.0.1:8000/docs
```

For the deployed version:

[Open Live Swagger Documentation](https://mental-health-score-8.onrender.com/docs?utm_source=chatgpt.com)

---

## 📁 Important Files

### `main.py`

Contains the FastAPI application, request validation, data preparation, and prediction endpoint.

### `Mental_Health_Model.pkl`

Contains the trained Machine Learning model.

### `index.html`

Contains the frontend structure.

### `style.css`

Contains the frontend styling and responsive design.

### `script.js`

Handles form validation, API requests, loading states, and displaying prediction results.

---

## ☁️ Deployment

The FastAPI backend is deployed using **Render**.

### Production API

[https://mental-health-score-8.onrender.com](https://mental-health-score-8.onrender.com?utm_source=chatgpt.com)

The frontend communicates with the deployed backend through the `/predict` API endpoint.

---

## ⚠️ Disclaimer

This application provides a **machine-learning-based prediction score** for educational and project purposes.

The predicted score should **not be considered a medical diagnosis or professional mental-health assessment**.

---

## 🔮 Future Improvements

* 📊 Prediction history
* 📈 Interactive analytics
* 👤 User authentication
* 💾 Database integration
* 📱 Progressive Web App
* 📉 Historical score visualization
* 🤖 Improved Machine Learning models
* ☁️ Full-stack cloud deployment
* 🔐 API security
* 🐳 Docker support

---

## 👨‍💻 Project

### MindPredict — Mental Health Score Predictor

```text
HTML + CSS + JavaScript
          │
          ▼
       FastAPI
          │
          ▼
 Machine Learning Model
          │
          ▼
 Mental Health Score
```

Built as a Machine Learning + Full-Stack project combining a web-based frontend with a FastAPI prediction API.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

