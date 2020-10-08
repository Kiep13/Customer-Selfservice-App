import { LightningElement, track, wire } from 'lwc';

import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import DISH_OBJECT from '@salesforce/schema/Dish__c';

export default class MenuListOptions extends LightningElement {

  @track controllingValues = [];
  @track dependentValues = [];
  @track selectedCategory;
  @track selectedSubcategory;
  @track isEmpty = false;
  @track error;
  controlValues;
  totalDependentValues = [];

  @wire(getObjectInfo, { objectApiName: DISH_OBJECT })
  objectInfo;

  @wire(getPicklistValuesByRecordType, { objectApiName: DISH_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
  categoryPicklistValues({error, data}) {
      if(data) {
          this.error = null;

          let categoryOptions = [{label:'--All--', value:'--All--'}];

          data.picklistFieldValues.Category__c.values.forEach(key => {
            categoryOptions.push({
                  label : key.label,
                  value: key.value
              })
          });

          this.controllingValues = categoryOptions;

          let subcategoryOptions = [{label:'--All--', value:'--All--'}];

          this.controlValues = data.picklistFieldValues.Subcategory__c.controllerValues;
          this.totalDependentValues = data.picklistFieldValues.Subcategory__c.values;

          console.log(this.controlValues);

          this.totalDependentValues.forEach(key => {
              subcategoryOptions.push({
                  label : key.label,
                  value: key.value
              })
          });

          this.dependentValues = subcategoryOptions;
      }
      else if(error) {
          this.error = JSON.stringify(error);
      }
  }

  handleCategoryChange(event) {
      this.selectedCategory = event.target.value;
      this.isEmpty = false;
      let dependValues = [];

      if(this.selectedCategory) {
          if(this.selectedCategory === '--All--') {
              this.isEmpty = true;
              dependValues = [{label:'--All--', value:'--All--'}];
              this.selectedCategory = null;
              this.selectedSubcategory = null;
              return;
          }

          this.totalDependentValues.forEach(conValues => {
              if(conValues.validFor[0] === this.controlValues[this.selectedCategory]) {
                  dependValues.push({
                      label: conValues.label,
                      value: conValues.value
                  })
              }
          })

          this.dependentValues = dependValues;
      }
  }

  handleSubcategoryChange(event) {
      this.selectedState = event.target.value;
  }

}