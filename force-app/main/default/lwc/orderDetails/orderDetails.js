import { LightningElement, api, track } from 'lwc';

export default class OrderDetails extends LightningElement {
  
  @api items;
  @track orderItems = [];

  columns = [
    {label: 'Dish', fieldName: 'Title__c'},
    {label: 'Comment', fieldName: 'Comment_to_dish__c'},
    {label: 'Amount', fieldName: 'Amount__c'},
    {label: 'Price', fieldName: 'Item_Price__c'},
  ];

  connectedCallback() {
    const intermedItems = JSON.parse(JSON.stringify(this.items));
    console.log(intermedItems);
    intermedItems.forEach((item) => {
      const orderItem = {};
      orderItem.Title__c = item.Dish__r.Title__c;
      orderItem.Comment_to_dish__c = item.Comment_to_dish__c;
      orderItem.Amount__c = item.Amount__c;
      orderItem.Item_Price__c = item.Item_Price__c;
      this.orderItems.push(orderItem);
    })
  }

  get isEmpty() {
    return this.orderItems.length == 0;
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

  submitDetails() {
    const selectedEvent = new CustomEvent('makeorder', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

}