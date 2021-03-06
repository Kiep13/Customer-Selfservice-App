/**
 * Class-controller for working with orders
 * checkOrderExistence checks whether an open order exists for the current user. If it doesn't exist, it creates it.
 * getOrder finds and returns an open order for the current user.
 * getPreviousOrders finds and returns closed orders for the current user.
 */
public with sharing class DishOrderController {
    
  @AuraEnabled
  public static void checkOrderExistence(){
    Id userId = UserInfo.getUserId();
    Dish_Order__c order;
        
    try {
      order = [SELECT Name FROM Dish_Order__c WHERE OwnerId = :userId AND Status__c = 'Open' LIMIT 1];
    } catch (System.QueryException queryException) {
      order = new Dish_Order__c();
      insert order;
    }
  }

  @AuraEnabled
  public static Dish_Order__c getOrder() {
    Id userId = UserInfo.getUserId();
    Dish_Order__c order = [SELECT Name FROM Dish_Order__c WHERE OwnerId = :userId AND Status__c = 'Open' LIMIT 1];

    return order;
  }

  @AuraEnabled
  public static List<Dish_Order__c> getPreviousOrders(){
    Id userId = UserInfo.getUserId();
    List<Dish_Order__c> orders;
        
    orders = [SELECT Name, 	Delivery__c, Delivery_address__c, 
                     Closed_Date__c, Status__c, convertCurrency(Total_Price__c) Total_Price__c,
                     (SELECT Dish__r.Title__c FROM Order_Items__r) 
              FROM Dish_Order__c WHERE OwnerId = :userId AND Status__c = 'Closed' ORDER BY Closed_Date__c];

    return orders;
  }
}