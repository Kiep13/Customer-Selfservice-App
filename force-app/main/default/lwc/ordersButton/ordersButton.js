import { LightningElement, track } from 'lwc';

export default class OrdersButton extends LightningElement {

  @track isOrdersModal = false;

  openModal() {
    console.log(this.isOrdersModal);
    this.isOrdersModal = true;
    console.log(this.isOrdersModal);
  }

  closeModal() {
    this.isOrdersModal = false;
  }

}