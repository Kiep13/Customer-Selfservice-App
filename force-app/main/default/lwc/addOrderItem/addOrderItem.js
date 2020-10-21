import { LightningElement, api, wire } from 'lwc';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import { publish, MessageContext } from 'lightning/messageService';

import TITLE_FIELD from '@salesforce/schema/Dish__c.Title__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Dish__c.Description__c';
import PRICE_FIELD from '@salesforce/schema/Dish__c.Price__c';

import ORDER_ITEM_OBJECT from '@salesforce/schema/Order_Item__c';
import DISH_FIELD from '@salesforce/schema/Order_Item__c.Dish__c';
import AMOUNT_FIELD from '@salesforce/schema/Order_Item__c.Amount__c';
import COMMENT_FIELD from '@salesforce/schema/Order_Item__c.Comment_to_dish__c';
import ORDER_FIELD from '@salesforce/schema/Order_Item__c.Dish_Order__c';

import addToOrder from '@salesforce/label/c.addToOrder';
import dishTitle from '@salesforce/label/c.dishTitle';
import description from '@salesforce/label/c.description';
import price from '@salesforce/label/c.price';
import amountPortions from '@salesforce/label/c.amountPortions';
import comment from '@salesforce/label/c.comment';
import cancel from '@salesforce/label/c.cancel';
import ok from '@salesforce/label/c.ok';
import close from '@salesforce/label/c.close';
import errorAddOrderItem from '@salesforce/label/c.errorAddOrderItem';
import sucessfullyAddToOrder from '@salesforce/label/c.sucessfullyAddToOrder';
import soHungry from '@salesforce/label/c.soHungry';
import warning from '@salesforce/label/c.warning';
import error from '@salesforce/label/c.error';
import success from '@salesforce/label/c.success';

export default class AddOredItem extends LightningElement {

  label = {
    addToOrder,
    dishTitle, 
    description,
    price,
    amountPortions,
    comment,
    cancel,
    ok,
    close,
    errorAddOrderItem
  }

  SUCCESS_TITLE = success;
  SUCCESS_MESSAGE = sucessfullyAddToOrder;
  SUCCESS_VARIANT = 'success';

  ERROR_TITLE = error;
  ERROR_MESSAGE = errorAddOrderItem;
  ERROR_VARIANT = 'error';

  WARNING_TITLE = warning;
  TOO_MUCH_DISHES_MESSAGE = soHungry;
  WARNING_VARIANT = 'warning';

  @wire(MessageContext)
  messageContext;

  @api dishid;
  @api orderid;
  dish;

  objectApiName = ORDER_ITEM_OBJECT;
  fields = [DISH_FIELD, AMOUNT_FIELD, COMMENT_FIELD];

  @wire(getRecord, { recordId: '$dishid', fields: [TITLE_FIELD, DESCRIPTION_FIELD, PRICE_FIELD]})
  wiredAccount({data, error}) {
    if (data) {
      this.dish = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.dish = undefined;
    }
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

  submitDetails() {

    const inputs = Array.from(
      this.template.querySelectorAll('lightning-input')
    );
    const [amount, comment] = inputs;

    if(!amount.value || +amount.value <= 0 || !!amount.value.split(".")[1]) {
      return;
    }

    if(+amount.value > 10) {
      this.showToast(this.WARNING_TITLE, this.TOO_MUCH_DISHES_MESSAGE, this.WARNING_VARIANT);
      return;
    }

    const recordInput = {
      apiName: ORDER_ITEM_OBJECT.objectApiName,
      fields: {
        [DISH_FIELD.fieldApiName] : this.dishid,
        [AMOUNT_FIELD.fieldApiName] : +amount.value,
        [COMMENT_FIELD.fieldApiName] : comment.value,
        [ORDER_FIELD.fieldApiName] : this.orderid,
      }
    };

    createRecord(recordInput)
      .then(result => {
        this.showToast(this.SUCCESS_TITLE, this.SUCCESS_MESSAGE, this.SUCCESS_VARIANT);
        this.publishMessage(result);
        this.closeModal();
      })
      .catch(error => {
        this.showToast(this.ERROR_TITLE, this.ERROR_MESSAGE, this.ERROR_VARIANT);
      });
  }

  publishMessage(orderItem) {
    const message = {
        orderItemId: orderItem.id,
        orderItemPrice: orderItem.fields.Item_Price__c.value
    };
    publish(this.messageContext, MESSAGE_CHANNEL, message);
  }

  showToast(title, message, variant) {
    const notification = new ShowToastEvent({
      title, message, variant
    });
    this.dispatchEvent(notification);
  }
}