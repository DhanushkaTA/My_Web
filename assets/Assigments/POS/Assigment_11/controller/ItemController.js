import {Item} from "../dto/Item.js";
import {getAllDB, saveItemDB, updateItemDB, deleteItemDB} from "../db/DB.js";

export class ItemController{
    constructor() {
        $('#itemAddBtn').on('click', () => {
            this.handleValidation("Save");
        });
        $('#itemUpdateBtn').on('click', () => {
            this.handleValidation("Update");
        });
        $('#itemDeleteBtn').on('click', () => {
            this.handleValidation("Delete");
        });
        $('#itemSearchBtn').on('click', () => {
            this.handleSearchItem();
        });
        $('#itemClearBtn').on('click', () => {
            this.clearTexts();
        });
        this.handleLoadItem();
        this.handleTableClickEvent();
    }

    handleValidation(Function) {

        !/^(I)([0-9]{2,})$/.test($('#itemId').val()) ? (alert("Invalid Item code"),$('#itemId').focus(),$('#itemId').css({background:"#faa7a7 !important"}))
            : !$('#itemDes').val() ? (alert("Description is empty !"),$('#itemDes').focus(),$('#itemDes').css({background:"#faa7a7 !important",border:"#ff0015 !important"})) :
            !/\d+$/.test($('#itemPrice').val()) ? (alert("Invalid unit price or empty !"),$('#itemPrice').focus(),$('#itemPrice').css({background:"#faa7a7 !important",border:"#ff0015 !important"})) :
                !/^\d+$/.test($('#itemQtyOnHand').val()) ? (alert("Invalid qty or empty !"),$('#itemQtyOnHand').focus(),$('#itemQtyOnHand').css({background:"#faa7a7 !important",border:"#ff0015 !important"})) :
                Function === "Save" ? this.handleSaveItem() : Function === "Update" ? this.handleUpdateItem() :
                    this.handleDeleteItem();
    }

    handleSaveItem(){

        if (this.handleExistingItem()){
            alert("Item code all ready exists !");
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want do save Item ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Save it!'
        }).then((result) => {
            if (result.isConfirmed) {

                saveItemDB(new Item($('#itemId').val(), $('#itemDes').val(), $('#itemPrice').val(), $('#itemQtyOnHand').val()));
                this.handleLoadItem();

                Swal.fire(
                    'Saved!',
                    'Your Item has been saved.',
                    'success'
                )
            }
        })


    }

    handleUpdateItem(){

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateItemDB(new Item($('#itemId').val(), $('#itemDes').val(), $('#itemPrice').val(), $('#itemQtyOnHand').val()));
                this.handleLoadItem();
                Swal.fire(
                    'Deleted!',
                    'Your file has been updated.',
                    'success'
                )
            }
        })


    }

    handleDeleteItem(){

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItemDB(new Item($('#itemId').val(), $('#itemDes').val(), $('#itemPrice').val(), $('#itemQtyOnHand').val()));
                this.handleLoadItem();
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })


    }

    handleLoadItem(){

        $('#itemTable tbody tr td').remove();

        getAllDB("ITEM").map((value) => {
            var row = "<tr>" +
                "<td>" + value._itemCode + "</td>" +
                "<td>" + value._description + "</td>" +
                "<td>" + value._unitPrice + "</td>" +
                "<td>" + value._qtyOnHand + "</td>" +
                "</tr>";

            $('#itemTable tbody').append(row);
        });


        this.clearTexts();

    }

    static handleLoadItemRefresh(){

        $('#itemTable tbody tr td').remove();

        getAllDB("ITEM").map((value) => {
            var row = "<tr>" +
                "<td>" + value._itemCode + "</td>" +
                "<td>" + value._description + "</td>" +
                "<td>" + value._unitPrice + "</td>" +
                "<td>" + value._qtyOnHand + "</td>" +
                "</tr>";

            $('#itemTable tbody').append(row);
        });

    }

    handleExistingItem(){

        let flag = false;
        getAllDB("ITEM").filter((event) => {
            if (event._itemCode === $('#itemId').val()) {
                flag = true;
            }
        });
        return flag;
    }

    handleTableClickEvent(){

        $('#itemTable tbody').on('click', 'tr', (event) => {
            $('#itemId').val($(event.target).closest('tr').find('td').eq(0).text())
            $('#itemDes').val($(event.target).closest('tr').find('td').eq(1).text())
            $('#itemPrice').val($(event.target).closest('tr').find('td').eq(2).text())
            $('#itemQtyOnHand').val($(event.target).closest('tr').find('td').eq(3).text())

        });
    }

    handleSearchItem(){
        let itemId = $('#itemSearch').val();
        let isFound=false;

        // getAllDB("ITEM").map((value) =>{
        //     if(value._itemCode===itemId){
        //         $('#itemId').val(value._itemCode)
        //         $('#itemDes').val(value._description)
        //         $('#itemPrice').val(value._unitPrice)
        //         $('#itemQtyOnHand').val(value._qtyOnHand)
        //     }
        // })
        for (let item of getAllDB("ITEM")){
            if(item._itemCode===itemId){
                $('#itemId').val(item._itemCode)
                $('#itemDes').val(item._description)
                $('#itemPrice').val(item._unitPrice)
                $('#itemQtyOnHand').val(item._qtyOnHand)
                isFound=true;
                this.handelMiniAlertInItem(itemId+' is found',isFound);
            }
        }
        if(!isFound){
            this.handelMiniAlertInItem(itemId+' is not found!',isFound);
        }
    }

    handelMiniAlertInItem(msg,isFound){
        let message=msg;
        let icn='success';
        if(!isFound){
            icn='error';
        }
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: icn,
            title: msg
        })
    }

    clearTexts(){
        $('#itemId').val("");
        $('#itemDes').val("");
        $('#itemPrice').val("");
        $('#itemQtyOnHand').val("");
        $('#itemSearch').val("")
    }
}
new ItemController();