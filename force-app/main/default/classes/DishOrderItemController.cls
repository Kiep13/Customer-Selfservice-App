public with sharing class DishOrderItemController {
    @AuraEnabled()
    public static List<Order_Item__c> getOrderItemsByOrderId(Id id) {
        List<Order_Item__c> items;

        try {
            items = [SELECT Dish__c, Dish_Order__c, Amount__c, Comment_to_dish__c, Item_Price__c
                    FROM Order_Item__c];
        } catch (System.QueryException queryException) {
            items = new List<Order_Item__c>();
        }

        return items;
    }

    @AuraEnabled(cacheable=true)
    public static List<Order_Item__c> getOrderItems(Id idddd) {
        List<Order_Item__c> items;

        System.debug(idddd);

        try {
            items = [SELECT Dish__c, Dish_Order__c, Amount__c, Comment_to_dish__c, Item_Price__c
                    FROM Order_Item__c ];
        } catch (System.QueryException queryException) {
            items = new List<Order_Item__c>();
        }

        return items;
    }

    @AuraEnabled(cacheable=true)
    public static Order_Item__c getOrderItemById(Id id) {
        return [SELECT Id, Dish__c, Dish_Order__c, Amount__c, Comment_to_dish__c, Item_Price__c
                FROM Order_Item__c WHERE Id = :id];
    }
}
