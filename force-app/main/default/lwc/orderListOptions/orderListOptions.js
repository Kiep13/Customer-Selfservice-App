import { LightningElement, api, track, wire } from 'lwc';

import ORDER_OBJECT from '@salesforce/schema/Dish_Order__c';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class OrderListOptions extends LightningElement {

  @api orders;

  @track dateValues = [];
  @track selectedDate;

  @track dishValues = [];
  @track selectedDish;

  @track statusValues = [];
  @track selectedStatus;

  @wire(getObjectInfo, { objectApiName: ORDER_OBJECT })
  objectInfo;

  @wire(getPicklistValuesByRecordType, { objectApiName: ORDER_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
  statusPicklistValues({error, data}) {
      if(data) {
          this.error = null;

          let statusOptions = [{label:'--All--', value:'--All--'}];

          data.picklistFieldValues.Status__c.values.forEach(key => {
            statusOptions.push({
                  label : key.label,
                  value: key.value
              })
          });

          this.statusValues = statusOptions;
          this.selectedStatus = '--All--';
      }
      else if(error) {
          this.error = JSON.stringify(error);
      }
  }

  connectedCallback() {
    this.buildDateArray();
    this.buildDishArray();
  }

  buildDateArray() {
    this.dateValues = [{label:'--All--', value:'--All--'}];
    const setDates = new Set();
    this.orders.forEach((order) => {
      setDates.add(order.Closed_Date__c);
    })

    for (let date of setDates.values()) {
      this.dateValues.push({
        label : date,
        value: date
      });
    }
  }

  buildDishArray() {
    this.dishValues = [{label:'--All--', value:'--All--'}];
    const setDishes = new Set();
    this.orders.forEach((order) => {
      const orderItems = order.Order_Items__r;
      orderItems.forEach((orderItem) => {
        setDishes.add(orderItem.Dish__r.Title__c);
      });
    })

    const arrayDishes = [...setDishes];
    arrayDishes.sort((firstTitle, secondTitle) => {
      return firstTitle.localeCompare(secondTitle);
    })

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