import { LightningElement, api, track, wire } from 'lwc';

import ORDER_OBJECT from '@salesforce/schema/Dish_Order__c';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import LOCALE from '@salesforce/i18n/locale';

import status from '@salesforce/label/c.status';
import date from '@salesforce/label/c.date';
import dish from '@salesforce/label/c.dish';
import all from '@salesforce/label/c.all';

export default class OrderListOptions extends LightningElement {

  all = all;

  label = {
    status,
    date,
    dish
  }

  @api orders;

  @track dateValues = [];
  @track selectedDate;

  @track dishValues = [];
  @track selectedDish;

  @track statusValues = [];
  @track selectedStatus;

  formattedDate;

  @wire(getObjectInfo, { objectApiName: ORDER_OBJECT })
  objectInfo;

  @wire(getPicklistValuesByRecordType, { objectApiName: ORDER_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
  statusPicklistValues({error, data}) {
    if(data) {
      this.error = null;

      let statusOptions = [{label:all, value:'--All--'}];

      data.picklistFieldValues.Status__c.values.forEach(key => {
        statusOptions.push({
          label : key.label,
          value: key.value
        })
      });

      this.statusValues = statusOptions;
      this.selectedStatus = '--All--';
    } else if(error) {
      this.error = JSON.stringify(error);
    }
  }

  connectedCallback() {
    this.formattedDate = new Intl.DateTimeFormat(LOCALE).format(new Date());
    this.buildDateArray();
    this.buildDishArray();
  }

  buildDateArray() {
    this.dateValues = [{label:all, value:'--All--'}];
    const setDates = new Set();
    this.orders.forEach((order) => {
      setDates.add(order.Closed_Date__c);
    })

    for (let date of setDates.values()) {
      const formattedDate = new Intl.DateTimeFormat(LOCALE).format(new Date(date));
      this.dateValues.push({
        label : formattedDate,
        value: date
      });
    }
  }

  buildDishArray() {
    this.dishValues = [{label:all, value:'--All--'}];
    const setDishes = new Set();
    this.orders.forEach((order) => {
      const orderItems = order.Order_Items__r;
      orderItems.forEach((orderItem) => {
        setDishes.add(orderItem.Dish__r.Title__c);
      });
    });

    const arrayDishes = [...setDishes];
    arrayDishes.sort((firstTitle, secondTitle) => {
      return firstTitle.localeCompare(secondTitle);
    });

    arrayDishes.forEach((dishTitle) => {
      this.dishValues.push({
        label: dishTitle,
        value: dishTitle
      })
    });
  }

  handleStatusChange(event) {
    this.selectedStatus= event.target.value;
    const selectedEvent = new CustomEvent('statuschange', {
      detail: this.selectedStatus,
    });
    this.dispatchEvent(selectedEvent);
  }

  handleDateChange(event) {
    this.selectedDate = event.target.value;
    const selectedEvent = new CustomEvent('datechange', {
      detail: this.selectedDate,
    });
    this.dispatchEvent(selectedEvent);
  }

  handleDishChange(event) {
    this.selectedDish = event.target.value;
    const selectedEvent = new CustomEvent('dishchange', {
      detail: this.selectedDish,
    });
    this.dispatchEvent(selectedEvent);
  }
}