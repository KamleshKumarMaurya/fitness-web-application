
# 🏋️‍♂️ Fitness Activity AI App

## 📖 Overview

This repository contains the full stack implementation of the **Fitness Activity AI App**, including both **backend services** and **UI (Ionic Angular app)**.
It allows users to track fitness activities and receive **AI-based insights, workout suggestions, and safety recommendations**.

---

## 🚀 Features

* **User**

  * Register / Login
  * Track fitness activities
  * View activity history
  * Get AI-based insights
  * Receive workout suggestions
  * Safety recommendations

* **Admin / System**

  * Activity analysis (pace, heart rate, calories)
  * AI-based recommendations
  * Kafka-based event processing
  * Manage users and activities

---

## 🛠️ Tech Stack

* **Java + SpringBoot** – REST API framework
* **PostgreSQL / MySQL** – Database
* **JWT** – Authentication
* **Apache Kafka** – Event streaming
* **Jackson** – JSON processing
* **AI API (OpenAI / Gemini)** – Activity analysis
* **Ionic Angular + Capacitor** – Mobile/Web UI

---

## 📂 Project Structure

fitness-app/
│── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── kafka/
│   │   ├── dto/
│   │   └── config/
│   ├── resources/
│   │   ├── application.yml
│
│── frontend-app/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── environments/
│   │   └── theme/
│   ├── ionic.config.json
│
│── docker-compose.yml
│── README.md

---

## 🔑 API Endpoints

### User

POST /api/users/register – Register

POST /api/users/login – Login

POST /api/activities – Add activity

GET /api/activities/{userId} – Get user activities

---

### AI / Processing

Kafka Consumer processes activity events

Generates AI-based fitness insights

---

## 🧪 Kafka Consumer

```java
@KafkaListener(
    topics = "${kafka.topic.request}",
    groupId = "activity-ai-processor"
)
public void consume(byte[] message) {
    try {
        Activity activity = objectMapper.readValue(message, Activity.class);
        processWithAI(activity);
    } catch (Exception e) {
        log.error("Failed to process Kafka message", e);
    }
}
```

---

## 🤖 AI Response Format

```json
{
  "analysis": {
    "overall": "",
    "pace": "",
    "heartRate": "",
    "caloriesBurned": ""
  },
  "improvements": [],
  "suggestions": [],
  "safety": []
}
```

---

## 🛠️ Setup

### Backend

git clone [https://github.com/your-username/fitness-ai-app.git](https://github.com/your-username/fitness-ai-app.git)

cd fitness-app/backend

mvn spring-boot:run

---

### Kafka

docker-compose up -d

---

### Frontend (Angular)

cd fitness-app/ui

npm install

ng serve

---

## 🔐 Security

JWT Authentication

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Kamlesh Maurya
Software Engineer (Java | Spring Boot | Angular | Ionic)

