import {getAllDB} from "../db/DB.js";

export class DashBoardController {

    constructor() {
        this.handleLabelDetails();
    }

    handleLabelDetails(){

        let date = new Date();
        let today=(date.getDate() +"/"+ (date.getMonth() + 1) + "/" + date.getFullYear());
        let year=date.getFullYear();

        let itemArray=getAllDB("ITEM");
        let customerArray=getAllDB("DATA");
        let orderArray=getAllDB("ORDER");

        $('#lblCustomer').text(customerArray.length);
        $('#lblItem').text(itemArray.length);
        $('#lblOrder').text(orderArray.length);

        let todayIncome=0;
        let yearIncome=0;
        console.log(orderArray)
        // for (let order of orderArray){
        //     if(date === order._orderDate){
        //         todayIncome=todayIncome + (+order.)
        //     }
        // }
        orderArray.map((value) =>{
            if(today === value._orderDate){
                todayIncome=todayIncome + (+value._finalTotal);
            }
            if((value._orderDate).endsWith(date.getFullYear().toString())){
                yearIncome=yearIncome + (+value._finalTotal);
            }
        })

        $('#lblToday').text(todayIncome);
        $('#lblYear').text(yearIncome);

    }

}

new DashBoardController();