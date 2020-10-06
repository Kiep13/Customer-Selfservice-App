import { LightningElement } from 'lwc';
import checkOrderExistence from '@salesforce/apex/DishOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/DishOrderController.getOrder';

export default class CurrentOrder extends LightningElement {

  order;
  error;
  orderItems;

  connectedCallback() {
    console.log('started 7.1');
    checkOrderExistence()
      .then(result => {
        console.log('started 7.2');
        this.loadOrder();
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
  }

  loadOrder() {
    getOrder()
    .then(result => {
      this.order = result;
      console.log(this.order);
    })
    .catch(error => {
      this.error = error;
      console.log(error);
    });
  }

}