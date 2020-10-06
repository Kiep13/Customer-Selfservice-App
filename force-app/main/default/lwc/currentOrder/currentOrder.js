import { LightningElement, wire, track } from 'lwc';
import checkOrderExistence from '@salesforce/apex/DishOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/DishOrderController.getOrder';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class CurrentOrder extends LightningElement {

  @wire(MessageContext)
  messageContext;

  isDetailsModalOpen = false;

  order;
  error;
  orderItems = [];

  connectedCallback() {
    checkOrderExistence()
      .then(result => {
        this.loadOrder();
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
    this.subscribeToMessageChannel();
  }

  get totalPrice() {
    let sum = 0;
    this.orderItems.forEach((orderItem) => {
      sum += +orderItem.fields.Item_Price__c.value;
    });
    return sum;
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
    this.orderItems.push(orderItem);
  }

  unsubscribeMessageChannel() {
      unsubscribe(this.subscription);
      this.subscription = null;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  } 

  openDetailsModal() {
    console.log(this.orderItems);
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
  }

}