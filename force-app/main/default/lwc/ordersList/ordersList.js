import { LightningElement, track, wire } from 'lwc';
import getPreviousOrders from '@salesforce/apex/DishOrderController.getPreviousOrders';

import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

import close from '@salesforce/label/c.close';
import previousOrders from '@salesforce/label/c.previousOrders';
import status from '@salesforce/label/c.status';
import date from '@salesforce/label/c.date';
import yourPreviousOrders from '@salesforce/label/c.yourPreviousOrders';
import code from '@salesforce/label/c.code';
import price from '@salesforce/label/c.price';
import totalOrdersPrice from '@salesforce/label/c.totalOrdersPrice';
import clearOrdersHistory from '@salesforce/label/c.clearOrdersHistory';
import noElements from '@salesforce/label/c.noElements';
import errorGetPreviousOrders from '@salesforce/label/c.errorGetPreviousOrders';

export default class OrdersList extends LightningElement {

  label = {
    close, 
    previousOrders,
    yourPreviousOrders,
    totalOrdersPrice,
    clearOrdersHistory,
    noElements,
    errorGetPreviousOrders
  }

  FILTER_ALL = '--All--';

  @track totalPrice;
  @track filteredOrders= [];
  @track loading = false;

  orders;
  error;

  filterStatus = this.FILTER_ALL;
  filterDate = this.FILTER_ALL;
  filterDish = this.FILTER_ALL;

  columns = [
    {label: code, fieldName: 'Name', hideDefaultActions: true},
    {label: date, fieldName: 'Closed_Date__c', hideDefaultActions: true, type: "date-local", typeAttributes:{
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }},
    {label: status, fieldName: 'Status__c', hideDefaultActions: true},
    {label: price, fieldName: 'Total_Price__c', type: 'currency', hideDefaultActions: true}
  ];

  connectedCallback() {
    this.loading = true;
    this.loadOldOrders();
  }

  get isEmpty() {
    return this.orders.length == 0;
  }

  get isEmptyFilter() {
    return this.filteredOrders.length == 0;
  }

  loadOldOrders() {
    getPreviousOrders()
    .then(result => {
      this.orders = result;
      this.filterOrders();
      this.solveTotalPrice();
      this.loading = false;
    })
    .catch(error => {
      this.error = error;
      console.log(error);
      this.loading = false;
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders;

    if(this.filterStatus != this.FILTER_ALL) {
      this.filteredOrders = this.filteredOrders.filter((order) => {
        return order.Status__c == this.filterStatus;
      })
    }

    if(this.filterDate != this.FILTER_ALL) {
      this.filteredOrders = this.filteredOrders.filter((order) => {
        return order.Closed_Date__c == this.filterDate;
      })
    }

    if(this.filterDish != this.FILTER_ALL) {
      this.filteredOrders = this.filteredOrders.filter((order) => {
        let orderItems = order.Order_Items__r;
        orderItems = orderItems.filter((orderItem) => {
          return orderItem.Dish__r.Title__c == this.filterDish;
        });
        return orderItems.length > 0;
      });
    }
  }

  solveTotalPrice() {
    let sum = 0.0;
    this.filteredOrders.forEach((order) => {
      sum += +order.Total_Price__c;
    });
    this.totalPrice = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: CURRENCY,
      currencyDisplay: 'symbol'
    }).format(sum.toFixed(2));
  }

  filterStatusChange(event) {
    this.filterStatus = event.detail;
    this.filterOrders();
    this.solveTotalPrice();
  }

  filterDateChange(event) {
    this.filterDate = event.detail;
    this.filterOrders();
    this.solveTotalPrice();
  }

  filterDishChange(event) {
    this.filterDish = event.detail;
    this.filterOrders();
    this.solveTotalPrice();
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }
}