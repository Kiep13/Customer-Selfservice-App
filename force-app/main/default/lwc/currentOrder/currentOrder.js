import { LightningElement, wire, track } from 'lwc';
import checkOrderExistence from '@salesforce/apex/DishOrderController.checkOrderExistence';
import getOrder from '@salesforce/apex/DishOrderController.getOrder';
import getOrderItemsByOrderId from '@salesforce/apex/DishOrderItemController.getOrderItemsByOrderId';
import getOrderItemById from '@salesforce/apex/DishOrderItemController.getOrderItemById';

import MESSAGE_CHANNEL from "@salesforce/messageChannel/OrderItemMessage__c";
import ORDER_MC from "@salesforce/messageChannel/OrderMessage__c";
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext, publish } from 'lightning/messageService';


export default class CurrentOrder extends LightningElement {

  @wire(MessageContext)
  messageContext;

  @track totalPrice = 0.0;
  isDetailsModalOpen = false;
  isConfirmModalOpen = false;

  @track order;
  error;
  orderItems = [];

  connectedCallback() {
    console.log('90');
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
    this.totalPrice = sum.toFixed(2);
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
    getOrderItemsByOrderId({id: this.order.Id})
      .then(result => {
        this.orderItems = result;
        this.resolveTotalPrice();
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
  }

  loadNewOrderItem(id) {
    getOrderItemById({id: id})
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
    this.totalPrice =(+this.totalPrice + +message.orderItemPrice).toFixed(2);
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
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
  }

  openConfirmModal() {
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
  }

  makeOrder() {
    this.closeDetailsModal();
    this.openConfirmModal();
  }

  submitOrder() {
    this.closeConfirmModal();
    checkOrderExistence()
      .then(result => {
        this.loadOrder();
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
  }
}