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
  SUCCESS_MESSAGE = 'Successfully submitted order';
  SUCCESS_VARIANT = 'success';

  ERROR_TITLE = 'Error';
  ERROR_MESSAGE = 'Error during submitting order';
  ERROR_VARIANT = 'error';

  DELIVERY_CHOISE = 'delivery';

  @api totalPrice;
  @api order;

  @track isDelivery = false;

  value = '';

  get options() {
    return [
        { label: 'Pickup', value: 'pickup' },
        { label: 'Home delivery', value: 'delivery' },
    ];
  }

  error;

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

  handleReceive(event) {
    const selectedOption = event.detail.value;
    this.isDelivery = selectedOption == this.DELIVERY_CHOISE;
  }

  makeOrder() {
    let date = new Date();

    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.order.Id;
    fields[STATUS_FIELD.fieldApiName] = 'Closed';
    fields[TOTAL_PRICE_FIELD.fieldApiName] = this.totalPrice;
    fields[DELIVERY_FIELD.fieldApiName] = this.isDelivery;
    fields[CLOSE_DATE_FIELD.fieldApiName] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    if(this.isDelivery) {
      const input = this.template.querySelector('lightning-input')
      const value = input.value;
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
        this.showToast(this.ERROR_TITLE. ERROR_MESSAGE, this.ERROR_VARIANT);
      });
  }

  showToast(title, message, variant) {
    const notification = new ShowToastEvent({
      title, message, variant
    });
    this.dispatchEvent(notification);
  }

}