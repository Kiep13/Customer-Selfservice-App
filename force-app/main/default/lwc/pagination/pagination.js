import { LightningElement, track, api } from 'lwc';

export default class Pagination extends LightningElement {

  @api currentPage;
  @api amountPages;

  @track isFirstDisabled = true;
  @track isPreviousDisabled = true;
  @track isNextDisabled = true;
  @track isLastDisabled = true;
  
  connectedCallback() {
    this.repaintPaginationButtons();
  }

  clickFirstPage() {
    this.currentPage = 1;
    this.changePage();
    this.repaintPaginationButtons();
  }

  clickNextPage() {
    if(this.currentPage >= this.amountPages) return;

    this.currentPage++;
    this.changePage();
    this.repaintPaginationButtons();
  }

  clickPreviousPage() {
    if(this.currentPage == 1) return;

    this.currentPage--;
    this.changePage();
    this.repaintPaginationButtons();
  }

  clickLastPage() {
    this.currentPage = this.amountPages;
    this.changePage();
    this.repaintPaginationButtons();
  }

  repaintPaginationButtons() {
    if(this.currentPage == 1) {
      this.isFirstDisabled = true;
      this.isPreviousDisabled = true;
    } else {
      this.isFirstDisabled = false;
      this.isPreviousDisabled = false;
    }

    if(this.currentPage >= this.amountPages) {
      this.isNextDisabled = true;
      this.isLastDisabled = true;
    } else {
      this.isNextDisabled = false;
      this.isLastDisabled = false;
    }
  }

  changePage() {
    const selectedEvent = new CustomEvent('pagechanged', {
      detail: this.currentPage,
    });
    this.dispatchEvent(selectedEvent);
  }
}