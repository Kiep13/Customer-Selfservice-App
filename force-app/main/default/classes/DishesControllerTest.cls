@isTest
public with sharing class DishesControllerTest {
    
    public static String TEST_DISH_NAME = 'Test dish';
    public static String TEST_DISH_CATEGORY = 'Bakery';
    public static String TEST_DISH_SUBCATEGORY = 'Bread';

    public static String EXPECTED_NO_DISHES = 'Actual amount of dishes does not equal to excpected. (Expected 0)';
    public static String INVALID_AMOUNT = 'Actual amount of dishes does not equal to excpected';

    @isTest
    public static void testEmptyDishes() {

        List<Dish__c> dishes = DishesController.getMenu();

        System.assertEquals(0, dishes.size(), EXPECTED_NO_DISHES);
    }

    @isTest
    public static void testWithDishData() {

        List<Dish__c> dishes = new List<Dish__c>();
        Integer length = 5;

        for(Integer i = 1; i <= length; i++) {
            Dish__c dish = new Dish__c(Title__c = TEST_DISH_NAME,
                                       Category__c = TEST_DISH_CATEGORY,
                                       Subcategory__c = TEST_DISH_SUBCATEGORY,
                                       Price__c = i);
            dishes.add(dish);
        }

        insert dishes;

        List<Dish__c> resultDishes = DishesController.getMenu();
        System.assertEquals(length, resultDishes.size(), INVALID_AMOUNT); 
    }
}
