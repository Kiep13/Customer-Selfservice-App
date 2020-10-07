public with sharing class TestCotrnoller {
    @AuraEnabled(cacheable=true)
    public static List<Order_Item__c> getTest(String id) {
        return new List<Order_Item__c>();
    }
}
