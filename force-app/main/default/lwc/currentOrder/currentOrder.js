import { LightningElement, wire } from 'lwc';
import checkOrderExistence from '@salesforce/apex/DishOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/DishOrderController.getOrder';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class CurrentOrder extends LightningElement {

  @wire(MessageContext)
  messageContext;

  order;
  error;
  orderItems;

  connectedCallback() {
    this.orderItems = [];

    console.log('started 7.1');
    checkOrderExistence()
      .then(result => {
        console.log('started 7.2');
        this.loadOrder();
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
    this.subscribeToMessageChannel();
  }

  loadOrder() {
    getOrder()
    .then(result => {
      this.order = result;
      console.log(this.order);
    })
    .catch(error => {
      this.error = error;
      console.log(error);
    });
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            MESSAGE_CHANNEL,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );
    }
    this.subscription = subscribe(
        this.messageContext,
        MESSAGE_CHANNEL, (message) => {
            this.handleMessage(message);
        });
  }

  handleMessage(message) {
    const orderItem = message.orderItem;
    console.log(orderItem);
    this.orderItems.push(orderItem);
    console.log('12');
  }

  unsubscribeMessageChannel() {
      unsubscribe(this.subscription);
      this.subscription = null;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  } 

}