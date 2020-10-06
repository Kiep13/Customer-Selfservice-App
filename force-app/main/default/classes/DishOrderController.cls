public with sharing class DishOrderController {
    @AuraEnabled(cacheable=true)
    public static Dish_Order__c getOrder() {
        Id userId = UserInfo.getUserId();
        Dish_Order__c order = [SELECT Name FROM Dish_Order__c WHERE OwnerId = :userId LIMIT 1];

        return order;
    }

    @AuraEnabled
    public static void checkOrderExistence(){
        Id userId = UserInfo.getUserId();
        Dish_Order__c order;
        
        try {
            order = [SELECT Name FROM Dish_Order__c WHERE OwnerId = :userId LIMIT 1];
        } catch (System.QueryException queryException) {
            order = new Dish_Order__c();
            insert order;
        }
    }
}
