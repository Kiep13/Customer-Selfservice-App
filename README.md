# Customer Selfservice App

Application for self-service restaurant visitors.
The application consist of a Lightning component. The app display the elements, which described below.

***

Requirements for basic elements:
 1. Menu. 
This should be a list of available dishes in this restaurant. For each dish, the following must be specified: name, price, and description of the dish. You should also be able to specify the number of servings and comments on the dish.
The menu should be able to navigate through the menu using filters and pages, with the ability to specify the number of displayed elements on the page.
Each item in the menu can be added to the order. The menu should consist of the main group and sub - items for this group. For testing, more than 25 dishes must be added to the 1st of the subgroups.
 
 2. Current order section.
This section should display the total cost of the order, which is automatically recalculated when the product is selected in the menu.
The button "Make an Order". Clicking this button creates an order that stores information about the user and the selected dishes.
The "Order Details" Button. When clicked, it shows the details of the current order - the selected dishes and the number of servings.
 
 3. The "Orders" Button.
Clicking this button should open a popup with a list of previous orders and their additional information. Also, this popup must specify the amount that is made up of the amount of orders already made. Orders can be filtered by the Order status and date fields, 1 of the dishes that participated in the order.

 4. The marketing team should be able to monitor the results of the application. Therefore, you need to create reports.
 
 5. The app should be able to make an order with home delivery.

***

 Notes:
- You need to create more than 100 test entries for dishes. 
- Dishes should be divided into categories and subcategories.
- When the user makes an order, an entry is automatically created with a list of selected dishes.
- Components should be user friendly and look nice.
- The app must be added to the Community.
