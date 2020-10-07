public with sharing class DishesController {
    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getMenu() {
        return [
            SELECT 	Title__c, Price__c, Description__c 
            FROM Dish__c
       ];
    }
}