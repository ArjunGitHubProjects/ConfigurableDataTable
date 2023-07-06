public with sharing class DataTableController {
    @AuraEnabled(cacheable=true)
    public static List<CofigurableDataTable__mdt> getColumnConfiguration() {
        // Fetch column configuration from custom metadata (DataTableColumnConfig__mdt)
        return [SELECT Conditions__c,Configuration__c,Is_Active__c,Object_API_Name__c,Table_Title__c FROM CofigurableDataTable__mdt];
    }

    
    
    @AuraEnabled(cacheable=true)
    public static List<SObject> fetchData(string objectName, List<string> fields, Integer pageNumber, Integer pageSize) {
        
        integer limitIs = ((pageNumber - 1) * pageSize);
        string ss = ''; 
        for(string str : fields){
      ss = ss + ','+str ;

        }
       // fields.replaceAll('[\\(\\)]','');
        //string fieldsList = fields.replaceAll('^\\(|\\)$', '');
        string fieldsList =  json.serialize(fields).remove('"').remove('[').remove(']');
       
        string qry ='SELECT  '+ fieldsList+ ' FROM '+  objectName + '  LIMIT '+pageSize + ' OFFSET '+limitIs;
        //SELECT  Name,AnnualRevenue,Description,Phone,Industry FROM Account  LIMIT :10 OFFSET :-10
        System.debug('qry'+ qry);
        
        List<SObject> records =  database.query(qry);
        return records;
    }
    
    @AuraEnabled
    public static void saveData(List<SObject> updatedRecords) {
        // Perform the necessary updates to save the modified records
        update updatedRecords;
    }
}