import { LightningElement, wire, track } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';

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

  @track order;
  error;
  orderItems = [];

  isDetailsModalOpen = false;
  isConfirmModalOpen = false;

  connectedCallback() {
    checkOrderExistence()
      .then(result => {
        this.loadOrder();
      })
      .catch(error => {
        this.error = error;
      });
    this.subscribeToMessageChannel();
  }

  loadOrder() {
    getOrder()
    .then(result => {
      this.order = result;
      this.loadOrderItems();
      this.publishMessage();
    })
    .catch(error => {
      this.error = error;
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
        this.resolveTotalPrice();
      });
  }

  loadNewOrderItem(id) {
    getOrderItemById({id: id})
    .then(result => {
      this.orderItems.push(result);
    })
    .catch(error => {
      this.error = error;
    });
  }

  resolveTotalPrice() {
    let sum = 0;
    this.orderItems.forEach((orderItem) => {
      sum += +orderItem.Item_Price__c;
    });
    this.totalPrice = sum.toFixed(2);
  }

  deleteOrderItem(event) {
    const id = event.detail;

    deleteRecord(id)
      .then(() => {
        this.orderItems = this.orderItems.filter((orderItem) => {
          return orderItem.Id != id;
        })
        this.resolveTotalPrice();
      })
     .catch(error => {
        this.error = error;
      });
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
      });
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

  unsubscribeToMessageChannel() {
      unsubscribe(this.subscription);
      this.subscription = null;
  }

  publishMessage() {
    const message = {
        orderId: this.order.Id
    };
    publish(this.messageContext, ORDER_MC, message);
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  } 
}