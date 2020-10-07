import { LightningElement, wire, track } from 'lwc';
import checkOrderExistence from '@salesforce/apex/DishOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/DishOrderController.getOrder';
import getOrderItemsByOrderId from '@salesforce/apex/DishOrderItemController.getOrderItemsByOrderId';
import getOrderItems from '@salesforce/apex/DishOrderItemController.getOrderItems';
import getOrderItemById from '@salesforce/apex/DishOrderItemController.getOrderItemById';
import getTest from '@salesforce/apex/TestCotrnoller.getTest';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import ORDER_MC from "@salesforce/messageChannel/OrderMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext, publish } from 'lightning/messageService';



export default class CurrentOrder extends LightningElement {

  @wire(MessageContext)
  messageContext;

  @track totalPrice = 0.0;
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

  resolveTotalPrice() {
    let sum = 0;
    this.orderItems.forEach((orderItem) => {
      sum += +orderItem.Item_Price__c;
    });
    this.totalPrice = sum;
  }

  loadOrder() {
    getOrder()
    .then(result => {
      this.order = result;
      this.loadOrderItems();
      setInterval(() => {
        this.publishMessage();
      }, 5000);
    })
    .catch(error => {
      this.error = error;
      console.log(error);
    });
  }

  loadOrderItems() {
    console.log('54');
    console.log(this.order);
    console.log(typeof this.order.Id);
    getOrderItemsByOrderId(this.order.Id)
      .then(result => {
        console.log('39');
        this.orderItems = result;
        this.resolveTotalPrice();
        console.log(this.orderItems);
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
  }

  loadNewOrderItem(id) {
    getOrderItemById(id)
    .then(result => {
      this.orderItems.push(result);
      console.log(this.orderItems);
    })
    .catch(error => {
      this.error = error;
      console.log(error);
    });
  }

  publishMessage() {
    const message = {
        orderId: this.order.Id
    };
    publish(this.messageContext, ORDER_MC, message);
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
  }

  handleMessage(message) {
    this.totalPrice += message.orderItemPrice;
    console.log(message.orderItemId);
    this.loadNewOrderItem(message.orderItemId);
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