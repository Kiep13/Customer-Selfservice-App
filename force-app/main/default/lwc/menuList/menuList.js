import { LightningElement, track, wire } from 'lwc';
import getMenu from '@salesforce/apex/DishesController.getMenu';

import ORDER_MC from "@salesforce/messageChannel/OrderMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class MenuList extends LightningElement {

  FILTER_ALL = '--All--';

  @wire(MessageContext)
  messageContext;

  @track dishId;
  @track orderId;

  @track displayesDishes = [];
  @track loading = false;

  @track currentPage = 1;
  @track amountPages;
  @track itemsOnPage = 6;

  @track isFirstDisabled = true;
  @track isPreviousDisabled = true;
  @track isNextDisabled = true;
  @track isLastDisabled = true;

  isModalOpen = false;

  filterCategory = this.FILTER_ALL;
  filterSubcategory = this.FILTER_ALL;

  dishes;
  error;

  connectedCallback() {
    this.loading = true;
    this.loadMenu();
    this.subscribeToMessageChannel();
  }

  get dishesLength() {
    return this.displayesDishes == 0;
  }

  loadMenu() {
    getMenu()
    .then(result => {
      this.dishes = result;
      this.resolveDisplayedDishes();
      this.loading = false;
    })
    .catch(error => {
      this.error = error;
      this.loading = false;
    });
  }

  resolveDisplayedDishes() {
    const filteredDishes = this.filterDishes();
    this.amountPages = Math.ceil(filteredDishes.length / this.itemsOnPage);
    console.log(this.amountPages);
    this.displayesDishes = filteredDishes.filter((item, index) => {
      return index >= (this.currentPage-1) * this.itemsOnPage && index < (this.currentPage) * this.itemsOnPage;
    });
    this.repaintPaginationButtons();
  }

  filterDishes() {
    if(this.filterCategory == this.FILTER_ALL) {
      return this.dishes;
    }

    const filteredDishes = this.dishes.filter((item) => {
      return item.Category__c == this.filterCategory;
    });

    if(this.filterSubcategory == this.FILTER_ALL) {
      return filteredDishes;
    }

    return filteredDishes.filter((item) => {
      return item.Subcategory__c == this.filterSubcategory;
    });
  }

  categoryChange(event) {
    this.filterCategory = event.detail;
  }

  subcategoryChange(event) {
    this.filterSubcategory = event.detail;
    this.currentPage = 1;
    this.resolveDisplayedDishes();
  }

  amountChange(event) {
    this.itemsOnPage = event.detail;
    this.resolveDisplayedDishes();
  }

  handleChoose(event) {
    this.dishId = event.detail;
    this.isModalOpen = true;
  }

  clickFirstPage() {
    this.currentPage = 1;
    this.resolveDisplayedDishes();
  }

  clickNextPage() {
    if(this.currentPage >= this.amountPages) return;

    this.currentPage++;
    this.resolveDisplayedDishes();
  }

  clickPreviousPage() {
    if(this.currentPage == 1) return;

    this.currentPage--;
    this.resolveDisplayedDishes();
  }

  clickLastPage() {
    this.currentPage = this.amountPages;
    this.resolveDisplayedDishes();
  }

  repaintPaginationButtons() {
    if(this.currentPage == 1) {
      this.isFirstDisabled = true;
      this.isPreviousDisabled = true;
    } else {
      this.isFirstDisabled = false;
      this.isPreviousDisabled = false;
    }

    if(this.currentPage >= this.amountPages) {
      this.isNextDisabled = true;
      this.isLastDisabled = true;
    } else {
      this.isNextDisabled = false;
      this.isLastDisabled = false;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
        this.subscription = subscribe(
          this.messageContext,
          ORDER_MC,
          (message) => this.handleMessage(message),
          { scope: APPLICATION_SCOPE }
        );
    }
  }

  handleMessage(message) {
    this.orderId = message.orderId;
  }

  unsubscribeToMessageChannel() {
      unsubscribe(this.subscription);
      this.subscription = null;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  } 
}