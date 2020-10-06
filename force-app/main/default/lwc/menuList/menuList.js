import { LightningElement, track } from 'lwc';
import getMenu from '@salesforce/apex/DishesController.getMenu';

export default class MenuList extends LightningElement {

  dishes;
  error;

  isModalOpen = false;
  @track dishId;

  connectedCallback() {
    this.loadMenu();
  }

  loadMenu() {
    getMenu()
    .then(result => {
      this.dishes = result;
    })
    .catch(error => {
      this.error = error;
    });
  }

  handleChoose(event) {
    this.dishId = event.detail;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}