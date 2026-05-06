# 🚀 Node.js CRUD API with Modern UI

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[![GitHub stars](https://img.shields.io/github/stars/Nadeer-Ansari/Nodejs-CRUD-API)](https://github.com/Nadeer-Ansari/Nodejs-CRUD-API/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Nadeer-Ansari/Nodejs-CRUD-API)](https://github.com/Nadeer-Ansari/Nodejs-CRUD-API/network)
[![GitHub issues](https://img.shields.io/github/issues/Nadeer-Ansari/Nodejs-CRUD-API)](https://github.com/Nadeer-Ansari/Nodejs-CRUD-API/issues)
[![GitHub license](https://img.shields.io/github/license/Nadeer-Ansari/Nodejs-CRUD-API)](https://github.com/Nadeer-Ansari/Nodejs-CRUD-API/blob/master/LICENSE)

### A Professional Full-Stack CRUD Application with Modern UI/UX

[Live Demo](#):  https://smart-crud-dashboard.onrender.com

</div>

## 📌 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 API Endpoints](#-api-endpoints)
- [🎯 Project Structure](#-project-structure)
- [🎨 UI Features](#-ui-features)
- [🧪 Testing](#-testing)
- [📱 Responsive Design](#-responsive-design)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👨‍💻 Author](#-author)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Features

### Backend Features
- ✅ **Complete CRUD Operations** (Create, Read, Update, Delete)
- ✅ **RESTful API Architecture**
- ✅ **MongoDB Database Integration**
- ✅ **Error Handling & Validation**
- ✅ **CORS Enabled**
- ✅ **Environment Ready**

### Frontend Features
- 🎨 **Modern Animated UI**
- 📱 **Fully Responsive Design**
- 📊 **Real-time Dashboard with Statistics**
- 💡 **Smart Suggestions Based on Data**
- 🎭 **Smooth Animations & Transitions**
- 🌈 **Gradient Color Schemes**
- 📈 **User Analytics Dashboard**

### UI Components
- ✨ Hero Section with Animated Welcome Message
- 📊 Statistics Cards with Counters
- 👥 User Management Table
- 🎯 Smart Suggestions Engine
- 🔄 Real-time Data Updates
- 🎨 Bootstrap 5 Components

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM Library
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **EJS** - Template Engine
- **Bootstrap 5** - CSS Framework
- **CSS3** - Custom Animations
- **JavaScript (ES6+)** - Client-side Logic
- **Font Awesome** - Icons

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Step-by-Step Setup

1. **Clone the repository**

```bash
git clone https://github.com/Nadeer-Ansari/Nodejs-CRUD-API.git
cd Nodejs-CRUD-API
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup MongoDB**

- Local MongoDB: Make sure MongoDB is running on mongodb://127.0.0.1:27017

- OR use MongoDB Atlas (cloud)

- Update the connection string in database/db.js

4. **Run the application**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

5. **Access the application**

- Web Interface: http://localhost:9000

- API Endpoints: http://localhost:9000/api/users

## 🚀 API Endpoints

| Method | Endpoint | Description | Status |
|--------|-----------|-------------|--------|
| GET | /api/users | Get all users | ✅ |
| GET | /api/users/:id | Get single user | ✅ |
| POST | /api/users | Create new user | ✅ |
| PUT | /api/users/:id | Update user | ✅ |
| DELETE | /api/users/:id | Delete user | ✅ |

## Sample API Request/Response

**POST /api/users**

```json
{
  "name": "John Doe",
  "age": 25,
  "place": "New York"
}
```

Response

```json
{
  "message": "User Created Successfully!",
  "user": {
    "_id": "607f1f2b9f1b2c3d4e5f6a7b",
    "name": "John Doe",
    "age": 25,
    "place": "New York",
    "__v": 0
  }
}
```

## 🎯 Project Structure

```text
Nodejs-CRUD-API/
│
├── 📁 public/
│   ├── 📁 css/
│   │   └── style.css          # Custom styles & animations
│   └── 📁 js/
│       └── script.js          # Frontend logic & dashboard
│
├── 📁 views/
│   ├── header.ejs             # Navigation & head section
│   ├── footer.ejs             # Scripts & closing tags
│   ├── home.ejs               # Dashboard homepage
│   ├── adduser.ejs            # Add user form
│   ├── showuser.ejs           # User listing table
│   └── updateuser.ejs         # Edit user form
│
├── 📁 models/
│   └── usermodel.js           # Mongoose schema
│
├── 📁 database/
│   └── db.js                  # MongoDB connection
│
├── index.js                   # Main application file
├── package.json               # Dependencies
└── README.md                  # Documentation
```
## 🎨 UI Features

### Dashboard Statistics
- Total Users Count - Real-time user statistics
- Average Age - Demographic analysis
- Unique Locations - Geographic distribution
- Recent Users - Latest 5 members

### Smart Suggestions Engine
The application intelligently analyzes your data and provides:

- 📈 Growth suggestions based on user count
- 👥 Age demographic insights
- 🌍 Geographic diversity recommendations
- 💡 Quick tips for better management

### Animations & Effects
- 🎭 Fade-in animations on page load
- 🔄 Hover effects on cards and buttons
- 📊 Smooth counter animations
- 💫 Loading spinners and transitions
- 🎨 Gradient backgrounds and shadows

---

## 🧪 Testing

### Using Postman
- Import the API endpoints

### Test CRUD operations:
- POST /api/users - Create user
- GET /api/users - Get all users
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

- Check response status codes (200, 201, 400, 404)

### Browser Testing
- Dashboard statistics update automatically
- Forms validate input data
- Delete confirmation dialogs
- Real-time table updates
- Responsive design on different screen sizes

---

## 📱 Responsive Design

| Device | Breakpoint | Features |
|--------|------------|----------|
| Mobile | < 768px | Stacked layout, smaller buttons, hamburger menu |
| Tablet | 768px - 1024px | Adjusted spacing, 2-column layout |
| Desktop | > 1024px | Full dashboard view, 3-4 column layout |

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=9000
MONGODB_URI=mongodb://127.0.0.1:27017/cdac
NODE_ENV=development
```

---

## 🚀 Deployment

### Deploy on Render (Recommended for Node.js)

- Sign up at render.com
- Click "New +" → "Web Service"
- Connect your GitHub repository

### Configure:
- Name: nodejs-crud-api
- Environment: Node
- Build Command: npm install
- Start Command: node index.js
- Add environment variables
- Click "Create Web Service"

### Deploy on Vercel

```bash
npm i -g vercel
vercel --prod
```

### Deploy on Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Deploy on Heroku
https://www.heroku.com/deploy/button.svg

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are greatly appreciated.

- Fork the Project

- Create your Feature Branch

```bash
git checkout -b feature/AmazingFeature
```

- Commit your Changes

```bash
git commit -m 'Add some AmazingFeature'
```

- Push to the Branch

```bash
git push origin feature/AmazingFeature
```

- Open a Pull Request

### Contribution Guidelines
- Update the README.md with details of changes
- Add comments to your code
- Follow the existing code style
- Test your changes thoroughly

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

```text
MIT License

Copyright (c) 2024 Nadeer Ansari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```

---

## 👨‍💻 Author

### Nadeer Ansari

- GitHub: [Nadeer-Ansari](https://github.com/Nadeer-Ansari)
- LinkedIn: [Nadeer Ansari](https://linkedin.com/in/nadeer-ansari)
- Portfolio: https://nadeer-ansari.netlify.app

---

## 🙏 Acknowledgments

- Node.js - JavaScript Runtime
- Express.js - Web Framework
- MongoDB - Database
- Bootstrap - UI Framework
- Font Awesome - Icons
- All contributors and users

---

## 📊 Project Status

| Feature | Status |
|---------|--------|
| Backend API | ✅ Complete |
| Frontend UI | ✅ Complete |
| Dashboard Analytics | ✅ Complete |
| Smart Suggestions | ✅ Complete |
| Responsive Design | ✅ Complete |
| Documentation | ✅ Complete |
| Deployment | 🚀 Ready |

---

## 🎯 Future Enhancements

- User Authentication & Authorization
- Search and Filter functionality
- Pagination for large datasets
- Export data to CSV/PDF
- User profile pictures upload
- Email notifications
- Advanced analytics charts
- Dark mode toggle
- Multi-language support
- Real-time WebSocket updates

---

## 🐛 Known Issues

None currently. Report issues here

---

## 📞 Support

For support, email anadeer13@gmail.com or open an issue on GitHub.

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!
