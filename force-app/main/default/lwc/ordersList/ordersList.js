import { LightningElement, track } from 'lwc';
import getPreviousOrders from '@salesforce/apex/DishOrderController.getPreviousOrders';

export default class OrdersList extends LightningElement {

  @track totalPrice;
  orders;
  error;

  columns = [
    {label: 'Date', fieldName: 'Closed_Date__c', type: 'date'},
    {label: 'Status', fieldName: 'Status__c'},
    {label: 'Price', fieldName: 'Total_Price__c', type: 'currency'}
  ];

  connectedCallback() {
    this.loadOldOrders();
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

  loadOldOrders() {
    getPreviousOrders()
    .then(result => {
      this.orders = result;
      this.solveTotalPrice();
    })
    .catch(error => {
      this.error = error;
      console.log(error);
    });
  }

  solveTotalPrice() {
    let sum = 0.0;
    this.orders.forEach((order) => {
      sum += +order.	Total_Price__c;
    });
    this.totalPrice = sum.toFixed(2);
  }

}