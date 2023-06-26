import {Order} from "../dto/Order.js";
import {Order_Item} from "../dto/Order_Item.js";
import {getAllDB, saveOrderDB,updateItemDB} from "../db/DB.js";
import {Item} from "../dto/Item.js";

var orderDetailsArray = [];
var customer;
var item;
var index;
var selectedItemCode;

export class OrderController {

    constructor() {
        $('#customerIdCmb').on('change', (event) => {
            this.handleCustomerDetails(event.target.value);
        });
        $('#itemIdCmb').on('change', (event) => {
            this.handleItemDetails(event.target.value);
        });
        $('#orderAddBtn').on('click', () => {
            this.handleValidation();
        });
        $('#placeOrderBtn').on('click', () => {
            this.handleSaveOrder();
        });

        // $('#itemQtyOrder').on('keyup', () => {
        //     this.handleQty();
        // });
        $('#resetBtn').on('click', () => {
            this.handleClearFunction();
        });
        $('#orderRemoveBtn').on('click', () => {
            this.handleRemoveItem();
        });
        $('#cancelOrderBtn').on('click', () => {
            this.handleClearOrderFunction();
        });
        $('#oCash').on('keyup', () => {
            this.handleChangMoney();
        });
        $('#conformBtn').on('click', () => {
           this.handleConformOrder();
        });
        $('#discountTxt').on('keyup', () => {
           this.handleDiscount();
        });

        this.handleTableClickEvent();
        this.handleOrderID();
        //this.handleComboBox();
        this.handDateTime();
        $('#resetBtn').css({visibility:'hidden'});
        $('#orderRemoveBtn').css({visibility:'hidden'});
        $('#discountTxt').val(0);
        document.getElementById('placeOrderBtn').disabled = true;
    }

    handleChangMoney(){
        let chang=(+$('#oCash').val()) - (+$('#oFinalTotal').text());
        $('#oChang').text(chang);
    }

    handleOrderID() {
        let date = new Date();

        let arr = getAllDB("ORDER");
        if (arr.length === 0) {
            $('#orderId').text(date.getFullYear()+"/"+(+date.getMonth()+1)+"/OID@0001");
            return;
        }
        //console.log(arr[arr.length - 1]._orderId);

        let old_arr = arr[arr.length - 1]._orderId;
        let data = old_arr.split("@");
        let num = +data[1];
        num++;
        //let y=date.getFullYear()+"/"+(+date.getMonth()+1)+"/OID";
        if(data[0]===(date.getFullYear()+"/"+(+date.getMonth()+1)+"/OID")){
            $('#orderId').text(data[0]+'@'+ String(num).padStart(4, '0'));
            //console.log(data[0]+'@'+ String(num).padStart(4, '0'))
        }else {
            data[0]=date.getFullYear()+"/"+(+date.getMonth()+1)+"/OID";
            $('#orderId').text(data[0]+'@'+ String(num).padStart(4, '0'));
        }

    }

    handDateTime() {
        let date = new Date();
        $('#orderDate').text(date.getDate() +"/"+ (date.getMonth() + 1) + "/" + date.getFullYear());
    }

    handleCustomerDetails(id) {

        getAllDB("DATA").map((value) => {
            if (value._id === id) {
                customer = value;
                $('#cusNameOrder').val(value._name);

                $('#customerCmb').css({borderBottom: "1px solid #ced4da"});
                customer = value;
            }
        });
    }

    handleItemDetails(itemId) {

        getAllDB("ITEM").map((value) => {
            if (value._itemCode === itemId) {
                item = value;
                $('#itemDesOrder').val(value._description);
                $('#itemPriceOrder').val(value._unitPrice);
                $('#itemQtyOnHandOrder').val(value._qtyOnHand);

                $('#itemCodeCmb').css({borderBottom: "1px solid #ced4da"});
                item = value;
            }
        });
    }

    handleValidation() {

        $('#customerIdCmb :selected').text() === "Choose Customer" ? (alert("Please select the customer details !"), $('#customerIdCmb').focus(), $('#customerIdCmb').css({border:"2px solid red"})) :
            $('#itemIdCmb :selected').text() === "Choose Item" ? (alert("Please select the item details !"), $('#itemIdCmb').focus(), $('#itemIdCmb').css({borderBottom: "2px solid red"})) :
                !/\d+$/.test($('#itemQtyOrder').val()) ? (alert("Qty invalid or empty 7777!"), $('#qty').focus(), $('#qty').css({borderBottom: "2px solid red"})) :
                    parseInt($('#itemQtyOrder').val()) > parseInt($('#itemQtyOnHandOrder').val()) ? (alert("Noo much qty left999 !"), $('#itemQtyOrder').focus(), $('#qty').css({borderBottom: "2px solid red"})) :
                        $('#orderAddBtn').text() === 'Add' ?  (console.log("vv"),this.handleAddItem() ): this.handleUpdateItem();


    }

    handleRemoveItem(){
        let itemId=$('#itemIdCmb :selected').text();
        let index = this.handleIsExists(itemId);
        console.log(index);

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {

                orderDetailsArray.splice(index,1);
                this.handleLoadTable();
                this.handlePlaceOrderBtn();
                this.handleClearFunction();
                Swal.fire(
                    'Removed!',
                    'Your item has been removed.',
                    'success'
                )
            }
        })
    }

    handleUpdateItem(){
        let itemId=$('#itemIdCmb :selected').text();
        let index = this.handleIsExists(itemId);
        console.log(index);

        console.log(orderDetailsArray[index]._qty);
        if(+$('#itemQtyOrder').val() < +$('#itemQtyOnHandOrder').val()){

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Update it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    orderDetailsArray[index]._qty=+$('#itemQtyOrder').val();
                    orderDetailsArray[index]._total=parseInt($('#itemPriceOrder').val()) * (+$('#itemQtyOrder').val());
                    this.handleLoadTable();
                    this.handleClearFunction();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Updated!',
                        titleText: 'Your item has been Updated.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })

        }else {
            alert('too mush qty');
        }
    }

    handleAddItem(){

        let itemId=$('#itemIdCmb :selected').text();
        let index = this.handleIsExists(itemId);
        console.log(index)

        if (index === -1) {
            orderDetailsArray.push(new Order_Item(item, $('#itemQtyOrder').val(), $('#itemQtyOrder').val() * $('#itemPriceOrder').val()));

        } else if ((parseInt(orderDetailsArray[index]._qty) + parseInt($('#itemQtyOrder').val())) > parseInt($('#itemQtyOnHandOrder').val())) {

            alert("Noo much qty left !");
            $('#itemQtyOrder').focus();
            $('#itemQtyOrder').css({borderBottom: "2px solid red"});

        } else {
            console.log("jjj")
            orderDetailsArray[index]._qty = parseInt(orderDetailsArray[index]._qty) + parseInt($('#itemQtyOrder').val());
            orderDetailsArray[index]._total = parseInt(orderDetailsArray[index]._qty) * parseInt($('#itemPriceOrder').val());

        }

        document.getElementById("itemIdCmb").selectedIndex = 0;
        this.handlePlaceOrderBtn();
        this.handleLoadTable();
        this.handleClearFunction();
    }

    handlePlaceOrderBtn(){
        if(orderDetailsArray.length>0){
            document.getElementById('placeOrderBtn').disabled = false;
        }else {
            document.getElementById('placeOrderBtn').disabled = true;
        }
    }

    handleClearFunction(){
        $('#orderAddBtn').text('Add');
        $('#orderAddBtn').css({background: '#157347', border: '#157347'});
        $('#itemDesOrder').val('');
        $('#itemQtyOnHandOrder').val("");
        $('#itemPriceOrder').val("");
        $('#itemQtyOrder').val("");
        $('#resetBtn').css({visibility:'hidden'});
        $('#orderRemoveBtn').css({visibility:'hidden'});

        $('#oCusId').text("");
        $('#oCusName').text("");
        $('#oItmCount').text("");
        $('#oDiscount').text(0);
        $('#oTotal').text(0);
        $('#oFinalTotal').text(0);
    }

    handleClearOrderFunction(){

        Swal.fire({
            title: 'Do you want to Cancel this Order?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00c204',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.clearOrderFunction();
                this.handlePlaceOrderBtn();
                Swal.fire(
                    'Canceled!',
                    'Your Order has been canceled.',
                    'success'
                )
            }
        })



    }

    clearOrderFunction(){
        this.handleClearFunction();
        $('#cusNameOrder').val('');

        document.getElementById("itemIdCmb").selectedIndex = 0;
        document.getElementById("customerIdCmb").selectedIndex = 0;

        orderDetailsArray.splice(0);
        this.handleLoadTable();
    }

    handleIsExists(itemId) {
        for(let index in orderDetailsArray){
            if(orderDetailsArray[index]._item._itemCode===itemId){
                return index;
            }
        }
        return -1;

    }

    handleSaveOrder() {

        if (orderDetailsArray.length === 0) {
            alert("Please add the order details first !");
            return;
        }

        $('#oId').text($('#orderId').text());
        $('#oDate').text($('#orderDate').text());
        $('#oCusId').text(customer._id);
        $('#oCusName').text(customer._name);
        $('#oItmCount').text(orderDetailsArray.length);
        $('#oDiscount').text($('#discountTxt').val());
        $('#oTotal').text($('#total').text());
        $('#oFinalTotal').text($('#fTotal').text());
        $('#oCash').focus();

    }

    handleConformOrder(){

         Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00c204',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Conform it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.placeOrder();
                Swal.fire(
                    'Order Placed!',
                    'Your Order has been placed.',
                    'success'
                )
            }
        })

    }

    placeOrder(){
        let newOrder=new Order($('#orderId').text(),
            customer,
            orderDetailsArray,
            $('#orderDate').text(),
            $('#discountTxt').val(),
            +$('#total').text(),
            +$('#fTotal').text());


        this.updateItemQty();
        saveOrderDB(newOrder);

        console.log(newOrder);

        orderDetailsArray = [];

        document.getElementById("customerIdCmb").selectedIndex = 0;
        document.getElementById('customerIdCmb').disabled = false;
        $('#cusNameOrder').text("");
        $('#oCash').val(0);

        this.item=null;
        this.customer=null;
        this.clearOrderFunction();
        this.handleLoadTable();
        this.handleOrderID();
        this.handlePlaceOrderBtn();
    }

    updateItemQty(){

        /**for(let value of orderDetailsArray){
            let itm=value._item;
            console.log(value._qty)
            console.log(itm._qtyOnHand)
            let newQty=(+itm._qtyOnHand)-(+value._qty);
            console.log(newQty)
            console.log(itm);
            console.log(new Item(itm._itemCode,itm._description,itm._unitPrice,newQty));
            updateItemDB(new Item(itm._itemCode,itm._description,itm._unitPrice,newQty));
        }*/

        orderDetailsArray.map((value) => {
            let itm=value._item;
            console.log(value._qty);
            console.log(itm._qtyOnHand);

            let newQty=(+itm._qtyOnHand)-(+value._qty);
            console.log("new Qty : "+newQty);
            console.log(itm);

            console.log(new Item(itm._itemCode,itm._description,itm._unitPrice,newQty));
            updateItemDB(new Item(itm._itemCode,itm._description,itm._unitPrice,newQty));

            console.log('-----------------------------------------------------')
        })

    }

    handleLoadTable() {
        console.log("tt")

        $('#orderTable tbody tr').remove();

        orderDetailsArray.map((value) => {
            var row = "<tr>" +
                "<td>" + value._item._itemCode + "</td>" +
                "<td>" + value._item._description + "</td>" +
                "<td>" + value._item._unitPrice + "</td>" +
                "<td>" + value._qty + "</td>" +
                "<td>" + value._total + "</td>" +
                "</tr>";

            $('#orderTable tbody').append(row);

        });

        this.handleTotals();
    }



    handleTotals(){
        var tot = 0;
        orderDetailsArray.map(value => {
            tot += value._total;
        });
        $('#total').text(tot);

        let discountValue=(+$('#total').text()) * ((+$('#discountTxt').val())/100);
        console.log(discountValue);
        let finalTot=(+$('#total').text())-discountValue;
        console.log(finalTot)
        $('#fTotal').text(finalTot);
    }

    handleDiscount(){
        let discountValue=(+$('#total').text()) * ((+$('#discountTxt').val())/100);
        console.log(discountValue);
        let finalTot=(+$('#total').text())-discountValue;
        console.log(finalTot)
        $('#fTotal').text(finalTot);
    }

    handleTableClickEvent() {

        $('#orderTable tbody').on('click', 'tr', (event) => {

            var arr = document.getElementById('itemIdCmb');
            for (var i = 0; i < arr.length; i++){
                if(arr[i].value === $(event.target).closest('tr').find('td').eq(0).text()){
                    arr.selectedIndex = i;
                }
            }
            selectedItemCode = $(event.target).closest('tr').find('td').eq(0).text();

            this.handleItemDetails(selectedItemCode);
            $('#itemQtyOrder').val($(event.target).closest('tr').find('td').eq(3).text());

            index = orderDetailsArray.findIndex(value => value._item._itemCode === $("#itemIdCmb :selected").text());

            $('#orderAddBtn').text('Update');
            $('#orderAddBtn').css({
                background: '#5f27cd', border: '#5f27cd'
            });
            $('#resetBtn').css({visibility:'visible'});
            $('#orderRemoveBtn').css({visibility:'visible'});

        });
    }

    handleQty() {
        if($('#itemQtyOrder').val()>$('#itemQtyOnHandOrder').val()){
            alert('Qty over the Qty On Hand!!!')
        }
    }

    static handleComboBox() {
        $('#itemIdCmb > option').remove();
        $('#customerIdCmb > option').remove();
        $('#itemIdCmb').append("<option>Choose Item</option>");
        $('#customerIdCmb').append("<option>Choose Customer</option>");

        getAllDB("ITEM").map((value) => {
            $('#itemIdCmb').append("<option>" + value._itemCode + "</option>");
        });

        getAllDB("DATA").map((value) => {
            $('#customerIdCmb').append("<option>" + value._id + "</option>");
        });
    }
}

new OrderController();