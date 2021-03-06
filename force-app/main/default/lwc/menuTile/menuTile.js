import { LightningElement, api, track } from 'lwc';

import category from '@salesforce/label/c.category';
import description from '@salesforce/label/c.description';
import price from '@salesforce/label/c.price';
import addToOrder from '@salesforce/label/c.addToOrder';

import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

export default class MenuTile extends LightningElement {

  label = {
    category,
    description,
    price,
    addToOrder
  }

  @api dish;
  @track formattedPrice;

  connectedCallback() {
    this.formattedPrice = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: CURRENCY,
      currencyDisplay: 'symbol'
    }).format(this.dish.Price__c);
  }

  handleClick() {
    const selectedEvent = new CustomEvent('choosed', {
      detail: this.dish,
    });
    this.dispatchEvent(selectedEvent);
  }

}