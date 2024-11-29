# Northcoders News API
This is a API for the Northcoders News platform, providing endpoints for interacting with articles, topics, users, and comments. It is built using Node.js, Express, and PostgreSQL and is designed to be used as a back-end service for a news aggregation or blogging website.

## **Hosted Version**

You can access the hosted version of this project here: [Hosted Link](https://my-nc-news-k94s.onrender.com/)

---

## **Summary**

The Northcoders News API includes the following features:
- **Articles**: Fetch all articles, fetch a single article by ID, post new articles, patch article votes, and delete articles.
- **Topics**: Fetch all topics and filter articles by topic.
- **Users**: Fetch all users and individual user details.
- **Comments**: Fetch all comments for an article, post a new comment, update votes on comments, and delete comments.

## Setup Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/northcoders-news-api.git
cd northcoders-news-api
```

### **2. Install Dependencies**
Ensure you have [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/) installed.

```bash
npm install
```

To run this project locally, you will need to create `.env` files containing the necessary environment variables for the development and test databases.

### Steps to Create Environment Files

1. Create two new files at the root of your project:
   - `.env.development`
   - `.env.test`

2. Add the following content to the respective files:

   - **.env.development**:
     
     PGDATABASE=nc_news
     

   - **.env.test**:
     
     PGDATABASE=nc_news_test
     

3. Save the files. These environment variables are required to connect to the PostgreSQL databases for the development and test environments.


### **4. Seed Local Database**

Run the following command to set up and seed the database:
```bash
npm run setup-dbs
npm run seed
```

---

### **5. Run Tests**

Run the test suite to ensure everything is working as expected:
```bash
npm test
```

---

### **6. Start the Server**

Start the local development server:
```bash
npm start
```

---
## **Minimum Requirements**

- **Node.js**: v16.0.0 or later
- **PostgreSQL**: v12.0.0 or later

--- 
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
