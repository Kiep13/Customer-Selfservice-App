/**
 * Class-controller for working with order items
 * getOrderItemsByOrderId finds and returns order items by related order's id
 * getOrderItemById finds and returns order item by it id
 */
public with sharing class DishOrderItemController {
  
  @AuraEnabled()
  public static List<Order_Item__c> getOrderItemsByOrderId(String id) {
    List<Order_Item__c> items;

    items = [SELECT Dish__r.Title__c, Dish_Order__c, Amount__c, Comment_to_dish__c, convertCurrency(Item_Price__c) Item_Price__c
             FROM Order_Item__c WHERE Dish_Order__c = :id];

    return items;
  }

  @AuraEnabled(cacheable=true)
  public static Order_Item__c getOrderItemById(String id) {
    return [SELECT Id, Dish__r.Title__c, Dish_Order__c, Amount__c, Comment_to_dish__c, convertCurrency(Item_Price__c) Item_Price__c
            FROM Order_Item__c WHERE Id = :id];
  }
}