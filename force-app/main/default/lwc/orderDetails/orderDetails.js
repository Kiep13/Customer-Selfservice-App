import { LightningElement, api } from 'lwc';

import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import DISH_FIELD from '@salesforce/schema/Order_Item__c.Dish__c';
import AMOUNT_FIELD from '@salesforce/schema/Order_Item__c.Amount__c';
import COMMENT_FIELD from '@salesforce/schema/Order_Item__c.Comment_to_dish__c';

export default class OrderDetails extends LightningElement {
  
  @api items;
  orderItems = [];

  connectedCallback() {
    this.orderItems = JSON.parse(JSON.stringify(this.items));
    console.log(this.orderItems);
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

  submitDetails() {
  }

}