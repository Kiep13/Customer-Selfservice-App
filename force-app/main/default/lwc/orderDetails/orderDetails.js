import { LightningElement, api, track } from 'lwc';

import close from '@salesforce/label/c.close';
import orderDetails from '@salesforce/label/c.orderDetails';
import dishYouOrdered from '@salesforce/label/c.dishYouOrdered';
import dish from '@salesforce/label/c.dish';
import comment from '@salesforce/label/c.comment';
import amount from '@salesforce/label/c.amount';
import price from '@salesforce/label/c.price';
import cancel from '@salesforce/label/c.cancel';
import makeOrder from '@salesforce/label/c.makeOrder';
import deleteLabel from '@salesforce/label/c.delete';
import noElements from '@salesforce/label/c.noElements';
import errorOrderDetails from '@salesforce/label/c.errorOrderDetails';

export default class OrderDetails extends LightningElement {
  
  label = {
    close, 
    orderDetails,
    dishYouOrdered,
    cancel,
    makeOrder,
    noElements,
    errorOrderDetails
  }

  @api items;
  @track orderItems = [];
  @track loading = false;

  actions = [
    { label: 'Delete', name: deleteLabel }
  ];

  columns = [
    {label: dish, fieldName: 'Title__c', hideDefaultActions: true},
    {label: comment, fieldName: 'Comment_to_dish__c', hideDefaultActions: true},
    {label: amount, fieldName: 'Amount__c', hideDefaultActions: true},
    {label: price, fieldName: 'Item_Price__c', type: 'currency', hideDefaultActions: true},
    {type: 'action', typeAttributes: { rowActions: this.actions, menuAlignment: 'right' }}
  ];

  connectedCallback() {
    const intermedItems = JSON.parse(JSON.stringify(this.items));
    intermedItems.forEach((item) => {
      const orderItem = {};
      orderItem.Id = item.Id;
      orderItem.Title__c = item.Dish__r.Title__c;
      orderItem.Comment_to_dish__c = item.Comment_to_dish__c;
      orderItem.Amount__c = item.Amount__c;
      orderItem.Item_Price__c = item.Item_Price__c;
      this.orderItems.push(orderItem);
    });
    this.loading = false;
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

  handleRowAction(event) {
    const row = JSON.parse(JSON.stringify(event.detail.row));

    const selectedEvent = new CustomEvent('deleted', {
      detail: row.Id,
    });
    this.dispatchEvent(selectedEvent);

    this.orderItems = this.orderItems.filter((orderItem) => {
      return orderItem.Id != row.Id;
    });
  }

  submitDetails() {
    const selectedEvent = new CustomEvent('makeorder', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }
}