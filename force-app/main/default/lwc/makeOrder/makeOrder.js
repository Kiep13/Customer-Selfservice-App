import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Dish_Order__c.Id';
import STATUS_FIELD from '@salesforce/schema/Dish_Order__c.Status__c';
import TOTAL_PRICE_FIELD from '@salesforce/schema/Dish_Order__c.Total_Price__c';
import DELIVERY_FIELD from '@salesforce/schema/Dish_Order__c.Delivery__c';
import DELIVERY_ADDRESS_FIELD from '@salesforce/schema/Dish_Order__c.Delivery_address__c';
import CLOSE_DATE_FIELD from '@salesforce/schema/Dish_Order__c.Closed_Date__c';

export default class MakeOrder extends LightningElement {

  SUCCESS_TITLE = 'Success';
  SUCCESS_VARIANT = 'success';
  SUCCESS_MESSAGE = 'Successfully submitted order';

  ERROR_TITLE = 'Error';
  ERROR_VARIANT = 'error';
  ERROR_MESSAGE = 'Error during submitting order';
  ERROR_EMPTY_ORDER = 'Can\' make empty order';

  WARNING_TITLE = 'Warning';
  WARNING_VARIANT = 'warning';
  DONT_SPECIFY_RECEIVE = 'Please, specify receive method';
  SPECIFY_DELIVERY_ADDRESS = 'Please, specify delivery address';

  DELIVERY_CHOISE = 'delivery';

  @api totalPrice;
  @api order;

  @track isDelivery = false;
  @track deliveryValue = '';

  value = '';

  error;

  get options() {
    return [
      { label: 'Pickup', value: 'pickup' },
      { label: 'Home delivery', value: 'delivery' },
    ];
  }

  handleReceive(event) {
    this.deliveryValue = event.detail.value;
    this.isDelivery = this.deliveryValue == this.DELIVERY_CHOISE;
  }

  makeOrder() {
    let date = new Date();

    if(this.totalPrice <= 0) {
      this.showToast(this.ERROR_TITLE, this.ERROR_EMPTY_ORDER, this.ERROR_VARIANT);
      return;
    }

    if(this.deliveryValue == '') {
      this.showToast(this.WARNING_TITLE, this.DONT_SPECIFY_RECEIVE, this.WARNING_VARIANT);
      return;
    }

    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.order.Id;
    fields[STATUS_FIELD.fieldApiName] = 'Closed';
    fields[TOTAL_PRICE_FIELD.fieldApiName] = this.totalPrice;
    fields[DELIVERY_FIELD.fieldApiName] = this.isDelivery;
    fields[CLOSE_DATE_FIELD.fieldApiName] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    if(this.isDelivery) {
      const input = this.template.querySelector('lightning-input')
      const value = input.value;

      if(value == '') {
        this.showToast(this.WARNING_TITLE, this.SPECIFY_DELIVERY_ADDRESS, this.WARNING_VARIANT);
        return;
      }

      fields[DELIVERY_ADDRESS_FIELD.fieldApiName] = value;
      input.value = ''
    }

    const recordInput = { fields };

    updateRecord(recordInput)
      .then(() => {
        const selectedEvent = new CustomEvent('submit', {
          detail: false,
        });
        this.dispatchEvent(selectedEvent);
        this.showToast(this.SUCCESS_TITLE, this.SUCCESS_MESSAGE, this.SUCCESS_VARIANT);
      })
      .catch(error => {
        this.showToast(this.ERROR_TITLE, this.ERROR_MESSAGE, this.ERROR_VARIANT);
      });
  }

  showToast(title, message, variant) {
    const notification = new ShowToastEvent({
      title, message, variant
    });
    this.dispatchEvent(notification);
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }
}