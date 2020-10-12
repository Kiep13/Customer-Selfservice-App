public with sharing class DishesController {
    @AuraEnabled(cacheable=true)
    public static List<Dish__c> getMenu() {
        List<Dish__c> dishes;

        try{
            dishes = [SELECT 	Title__c, Price__c, Description__c, Category__c, Subcategory__c
                      FROM Dish__c];
        } catch (System.QueryException queryException) {
            dishes = new List<Dish__c>();
        }

        return dishes;
    }
}
