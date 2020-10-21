import { LightningElement, track } from 'lwc';
import orders from '@salesforce/label/c.orders';

export default class OrdersButton extends LightningElement {

  label = {
    orders
  }

  @track isOrdersModal = false;

  openModal() {
    this.isOrdersModal = true;
  }

  closeModal() {
    this.isOrdersModal = false;
  }
}