@IsTest
public with sharing class DishOrderControllerTest {
 
    public static String OPEN_STATUS = 'Open';
    public static String CLOSE_STATUS = 'Closed';

    public static String EXPECTED_ORDER_CREATION = 'Expected creation of order.';
    public static String INVALID_AMOUNT_OF_ORDERS = 'Actual amount of orders does not equal to expected';
    public static String INVALID_ID_OF_ORDER = 'Actual id of order does not equal to expected';

    @IsTest
    public static void checkOrderExistence() {

        DishOrderController.checkOrderExistence();

        List<Dish_Order__c> orders = [SELECT Name FROM Dish_Order__c];

        System.assertEquals(1, orders.size(), EXPECTED_ORDER_CREATION);

    }

    @IsTest
    public static void checkOrderExistenceWithExists() {

        Dish_Order__c order = new Dish_Order__c(Status__c = OPEN_STATUS);

        insert order;

        DishOrderController.checkOrderExistence();

        List<Dish_Order__c> ordersResult = [SELECT Name FROM Dish_Order__c];

        System.assertEquals(1, ordersResult.size(), INVALID_AMOUNT_OF_ORDERS);
        System.assertEquals(order.Id, ordersResult[0].Id, INVALID_ID_OF_ORDER);

    }

    @IsTest
    public static void getOrderTest() {
        Dish_Order__c order = new Dish_Order__c(Status__c = OPEN_STATUS);

        insert order;

        Dish_Order__c orderResult = DishOrderController.getOrder();

        System.assertEquals(order.Id, orderResult.Id, INVALID_ID_OF_ORDER);
    }

    @IsTest
    public static void getPreviousOrdersEmpty() {
        List<Dish_Order__c> ordersResult;

        try {
            ordersResult = DishOrderController.getPreviousOrders();
        } catch (System.QueryException queryException) {
            System.assertEquals(queryException.getMessage(), queryException.getMessage());
        }

        System.assertEquals(0, ordersResult.size(), INVALID_AMOUNT_OF_ORDERS); 
    }

    @IsTest
    public static void getPreviousOrders() {
        List<Dish_Order__c> orders = new List<Dish_Order__c>();
        Integer length = 5;

        for(Integer i = 1; i <= length; i++) {
            Dish_Order__c order = new Dish_Order__c(Status__c = CLOSE_STATUS);
            orders.add(order);
        }

        insert orders;

        List<Dish_Order__c> ordersResult = DishOrderController.getPreviousOrders();

        System.assertEquals(length, ordersResult.size(), INVALID_AMOUNT_OF_ORDERS);
    }
}
