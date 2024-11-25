# Northcoders News API

## Setup Instructions

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

---

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
