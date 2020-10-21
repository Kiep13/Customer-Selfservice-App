import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Dish_Order__c.Id';
import STATUS_FIELD from '@salesforce/schema/Dish_Order__c.Status__c';
import TOTAL_PRICE_FIELD from '@salesforce/schema/Dish_Order__c.Total_Price__c';
import DELIVERY_FIELD from '@salesforce/schema/Dish_Order__c.Delivery__c';
import DELIVERY_ADDRESS_FIELD from '@salesforce/schema/Dish_Order__c.Delivery_address__c';
import CLOSE_DATE_FIELD from '@salesforce/schema/Dish_Order__c.Closed_Date__c';

import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

import orderConfirmation from '@salesforce/label/c.orderConfirmation';
import totalOrderPrice from '@salesforce/label/c.totalOrderPrice';
import receiveMethod from '@salesforce/label/c.receiveMethod';
import pickup from '@salesforce/label/c.pickup';
import homeDelivery from '@salesforce/label/c.homeDelivery';
import specifyAddress from '@salesforce/label/c.specifyAddress';
import cancel from '@salesforce/label/c.cancel';
import confirmOrder from '@salesforce/label/c.confirmOrder';
import close from '@salesforce/label/c.close';
import errorSubmitOrder from '@salesforce/label/c.errorSubmitOrder';
import warning from '@salesforce/label/c.warning';
import error from '@salesforce/label/c.error';
import success from '@salesforce/label/c.success';
import succesSubmitOrder from '@salesforce/label/c.succesSubmitOrder';
import errorEmptyOrder from '@salesforce/label/c.errorEmptyOrder';
import warningReceiveMethod from '@salesforce/label/c.warningReceiveMethod';
import warningSpecifyAddress from '@salesforce/label/c.warningSpecifyAddress';

export default class MakeOrder extends LightningElement {

  label = {
    orderConfirmation,
    totalOrderPrice,
    receiveMethod,
    specifyAddress,
    cancel,
    confirmOrder,
    close,
    errorSubmitOrder
  }

  SUCCESS_TITLE = success;
  SUCCESS_MESSAGE = succesSubmitOrder;
  SUCCESS_VARIANT = 'success';

  ERROR_TITLE = error;
  ERROR_VARIANT = 'error';
  ERROR_MESSAGE = errorSubmitOrder;
  ERROR_EMPTY_ORDER = errorEmptyOrder;

  WARNING_TITLE = warning;
  WARNING_VARIANT = 'warning';
  DONT_SPECIFY_RECEIVE = warningReceiveMethod;
  SPECIFY_DELIVERY_ADDRESS = warningSpecifyAddress;

  DELIVERY_CHOISE = 'delivery';

  @api totalPrice;
  @track displayedPrice = 0.0;
  @api order;

  @track isDelivery = false;
  @track deliveryValue = '';

  value = '';

  error;

  connectedCallback() {
    this.displayedPrice = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: CURRENCY,
      currencyDisplay: 'symbol'
    }).format(this.totalPrice);
  }

  get options() {
    return [
      { label: pickup, value: 'pickup' },
      { label: homeDelivery, value: 'delivery' },
    ];
  }

  handleReceive(event) {
    this.deliveryValue = event.detail.value;
    this.isDelivery = this.deliveryValue == this.DELIVERY_CHOISE;
  }

  makeOrder() {
    let date = new Date();

    console.log(this.totalPrice);
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
      input.value = '';
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