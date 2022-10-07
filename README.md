# Module 13 Chalenge - Oject-Relational Mapping (ORM) : E-commerce Back End
This program is a server side application using node.js, express.js, dotenv, sequelize and mysql2. Since this is a server side application all functionality will be tested using a third party tool, and in this challenge, I will be using Insomnia to demonstrate the database connectivtiy. This "MySQL" database has 4 tables,  (Category, Tag, Product and ProductTag), with two tables having attributes of a "many to many" type relationship. As I demonstrate the ("DELETE" "PUT" "POST" "GET") operations, you will see how "foregn-keys" create the table to table relationships. 


## Running the E-Commerce back end server.
* From the Terminal prompt, in this projects main folder, type "npm start". This will start the server and on the terminal you should see a prompt denoting that it is listening. In otherwords, waiting for connection requests. 

    # Tables 
    - <b>Category</b>
        * ID 
            - Integer Value
            - Doesn't allow for nulls
            - Set as primary Key
            - Auto Incriments
        * Category_Name
            - String Value
            - Doesn't allow for nulls
    
    - <b>Product</b>
        * ID
            - Integer Value
            - Doesn't allow for nulls
            - Set as primary Key
            - Auto Incriments
        * Product_Name
            - String Value
            - Doesn't allow for nulls
        * Price
            - Decimal Value
            - Doesn't allow for nulls
            - Validates for decimal entries
        * Stock
            - Integer Value
            - Doesn't allow for nulls
            - Default value is set at 10
            - Validates for numeric entries
        * <u>Category_ID</u>
            - Integer Value
            - <u>References the "Category" tables ID.</u>

    - <b>Tag</b>
        * ID
            - Integer Value
            - Doesn't allow for nulls
            - Set as primary Key
            - Auto Incriments
        * Tag_Name
            - String Value

    - <b>ProductTag</b>
        * ID
            - Integer Value
            - Doesn't allow for nulls
            - Set as primary Key
            - Auto Incriments
        * <u>Product_ID</u>
            - Integer Value
            - <u>References the "Product" tables ID.</u>
        * <u>Category_ID</u>
            - Integer Value
            - <u>References the "Category" tables ID.</u>

* The above tables will have the following relationships:
    - Product <b>belongs to</b> Category   AND
    - Category <b>can have many</b> Products
        - This relationship Means multiple products to one category.
    
    - Product <b>belongs to many</b> Tag via ProductTag   AND
    - Tag <b>belongs to many</b> Product via ProductTag
        - These three table are used in conjunction to allow this many to many relationship.


### Special Notes:
* Scripts have been put in place to handle the intialization of the database and will be demonstrated in a walkthrough video.

* Packages installed for this application and use are as follows:
    - MySQL2 : Controls database activity and connection.
    - Sequelize : Handles all query selections.
    - Express : Controls the API connectivity.
    - DotEnv : Handles our hidden enviornment variables.

* Link to walkthrough video.



### Screen Shots.
* mysql login - database initialization

* npm run seed - Loads tables with test data.

* npm start - Starts server listening on LocalHost:3001
