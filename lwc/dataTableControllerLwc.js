import { LightningElement, wire , track} from 'lwc';
import getColumnConfiguration from '@salesforce/apex/DataTableController.getColumnConfiguration';
import fetchData from '@salesforce/apex/DataTableController.fetchData';
import saveData from '@salesforce/apex/DataTableController.saveData';

export default class DataTableControllerLwc extends LightningElement {

   @track columns= [];
   @track data;
   @track draftValues = [];
@track objectApiName;
@track tableTitle;

    @wire(getColumnConfiguration)
    retrieveColumnConfig({ data, error }) {
        if (data) {
           
              console.log('data',data);
                this.tableTitle = data[0].Table_Title__c;
                this.objectApiName = data[0].Object_API_Name__c;
                let configurations = JSON.parse(data[0].Configuration__c);
                console.log("configurations",configurations, configurations.length );
                let localColumns=[];
                let fields = [];
                for (var i = 0 ; i < configurations.length ; i++ ){
                    let columnVal = {label:configurations[i].label, fieldName :configurations[i].Name , type : configurations[i].type }
                    localColumns.push(columnVal);
                    fields.push(configurations[i].Name);
                }
                console.log('localColumns',localColumns);
                this.columns =  localColumns;
                if( this.columns){
                    this.getDeta(fields,this.objectApiName);


                }
        } else if (error) {
            console.error(error);
        }
    }

    getDeta(fields,objectApiName){
        fetchData({ objectName: objectApiName, fields: fields, pageNumber: 1, pageSize: 10 })
        .then(result => {
            console.log('result======>',result);
            this.data = result;
            
        });

    }


    // @wire(fetchData, { pageNumber: 1, pageSize: 10 })
    // retrieveData({ data, error }) {
    //     if (data) {
    //         this.data = data;
    //     } else if (error) {
    //         console.error(error);
    //     }
    // }

    handleSave(event) {
        const updatedRecords = event.detail.draftValues;
        saveData({ updatedRecords })
            .then(() => {
                // Handle any additional logic after successful save
                this.draftValues = [];
            })
            .catch((error) => {
                console.error(error);
            });
    }
}