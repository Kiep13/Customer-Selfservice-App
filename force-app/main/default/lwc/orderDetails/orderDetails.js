import { LightningElement, api, track } from 'lwc';

export default class OrderDetails extends LightningElement {
  
  @api items;
  @track orderItems = [];
  @track loading = false;

  actions = [
    { label: 'Delete', name: 'delete' }
  ];

  columns = [
    {label: 'Dish', fieldName: 'Title__c', hideDefaultActions: true},
    {label: 'Comment', fieldName: 'Comment_to_dish__c', hideDefaultActions: true},
    {label: 'Amount', fieldName: 'Amount__c', hideDefaultActions: true},
    {label: 'Price', fieldName: 'Item_Price__c', hideDefaultActions: true},
    {type: 'action', typeAttributes: { rowActions: this.actions, menuAlignment: 'right' }}
  ];

  connectedCallback() {
    const intermedItems = JSON.parse(JSON.stringify(this.items));
    intermedItems.forEach((item) => {
      const orderItem = {};
      orderItem.Id = item.Id;
      orderItem.Title__c = item.Dish__r.Title__c;
      orderItem.Comment_to_dish__c = item.Comment_to_dish__c;
      orderItem.Amount__c = item.Amount__c;
      orderItem.Item_Price__c = item.Item_Price__c;
      this.orderItems.push(orderItem);
    });
    this.loading = false;
  }

  get isEmpty() {
    return this.orderItems.length == 0;
  }

  closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }

  handleRowAction(event) {
    const row = JSON.parse(JSON.stringify(event.detail.row));

    const selectedEvent = new CustomEvent('deleted', {
      detail: row.Id,
    });
    this.dispatchEvent(selectedEvent);

    this.orderItems = this.orderItems.filter((orderItem) => {
      return orderItem.Id != row.Id;
    });
  }

  submitDetails() {
    const selectedEvent = new CustomEvent('makeorder', {
      detail: false,
    });
    this.dispatchEvent(selectedEvent);
  }
}