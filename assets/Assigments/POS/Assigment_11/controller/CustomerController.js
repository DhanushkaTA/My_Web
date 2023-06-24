import {Customer} from "../dto/Customer.js";
import {getAllDB, saveCustomerDB, updateCustomerDB, deleteCustomerDB} from "../db/DB.js";

export class CustomerController {
    constructor() {
        //$('#saveBtn').click(this.handleValidation.bind(this));
        $('#btnCustomerSave').on('click', () => {
            this.handleValidation("Save");
        });
        $('#btnCustomerUpdate').on('click', () => {
            this.handleValidation2("Update");
        });
        $('#btnCustomerDelete').on('click', () => {
            this.handleValidation2("Delete");
        });
        $('#customerSearchBtn').on('click', () => {
            this.handleSearchCustomer();
        });
        $('#customerClearBtn').on('click', () => {
            this.clearTexts();
        });
        // this.handleSaveCustomer.bind(this);
        this.handleLoadCustomer();
        this.handleTableClickEvent();
    }

    handleValidation(Function) {

        !/^(C)([0-9]{2,})$/.test($('#customerIdNew').val()) ? alert("Invalid ID") : !$('#customerNameNew').val() ? alert("Invalid name") :
            !$('#customerAddressNew').val() ? alert("Invalid address") : !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#customerContactNew').val()) ? alert("Invalid Tele") :
                Function === "Save" ? this.handleSaveCustomer() : Function === "Update" ? this.handleUpdateCustomer() :
                    this.handleDeleteCustomer();
    }

    handleValidation2(Function) {

        !/^(C)([0-9]{2,})$/.test($('#customerId').val()) ? alert("Invalid ID") : !$('#customerName').val() ? alert("Invalid name") :
            !$('#customerAddress').val() ? alert("Invalid address") : !/^(075|077|071|074|078|076|070|072)([0-9]{7})$/.test($('#customerContact').val()) ? alert("Invalid Tele") :
                Function === "Save" ? this.handleSaveCustomer() : Function === "Update" ? this.handleUpdateCustomer() :
                    this.handleDeleteCustomer();
    }

    handleSaveCustomer() {

        if (this.handleExistsCustomer()) {
            alert("Customer ID all ready exists !");
            return;
        }


        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "Do you want to add this customer",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                saveCustomerDB(new Customer($('#customerIdNew').val(), $('#customerNameNew').val(), $('#customerAddressNew').val(), $('#customerContactNew').val()));
                this.handleLoadCustomer();
                swalWithBootstrapButtons.fire(
                    'Added!',
                    'Your file has been deleted.',
                    'success'
                )

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
                    icon: 'success',
                    title: 'Registration in successfully'
                })

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        })




    }

    handleUpdateCustomer() {

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
                updateCustomerDB(new Customer($('#customerId').val(), $('#customerName').val(), $('#customerAddress').val(), $('#customerContact').val()));
                this.handleLoadCustomer();

                Swal.fire(
                    'Updated!',
                    'Your file has been updated.',
                    'success'
                )
            }
        })


    }

    handleDeleteCustomer() {

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

                deleteCustomerDB(new Customer($('#customerId').val(), $('#customerName').val(), $('#customerAddress').val(), $('#customerContact').val()));
                this.handleLoadCustomer();

                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })


    }

    handleLoadCustomer() {

        $('#tableCustomer tbody tr td').remove();

        getAllDB("DATA").map((value) => {
            var row = "<tr>" +
                "<td>" + value._id + "</td>" +
                "<td>" + value._name + "</td>" +
                "<td>" + value._address + "</td>" +
                "<td>" + value._contact + "</td>" +
                "</tr>";

            $('#tableCustomer tbody').append(row);
        });


        //clearData();
        this.clearTexts();

        $('#customerIdNew').val("");
        $('#customerNameNew').val("");
        $('#customerAddressNew').val("");
        $('#customerContactNew').val("");

    }

    handleExistsCustomer() {

        let flag = false;
        getAllDB("DATA").filter((event) => {
            if (event._id === $('#id').val()) {
                flag = true;
            }
        });
        return flag;
    }

    handleTableClickEvent() {

        $('#tableCustomer tbody').on('click', 'tr', (event) => {
            $('#customerId').val($(event.target).closest('tr').find('td').eq(0).text())
            $('#customerName').val($(event.target).closest('tr').find('td').eq(1).text())
            $('#customerAddress').val($(event.target).closest('tr').find('td').eq(2).text())
            $('#customerContact').val($(event.target).closest('tr').find('td').eq(3).text())

        });
    }

    handleSearchCustomer(){
        var customerId = $('#cusSearch').val();
        let isFound=false;

        for (let customer of getAllDB("DATA")){
            if(customer._id===customerId){
                $('#customerId').val(customer._id)
                $('#customerName').val(customer._name)
                $('#customerAddress').val(customer._address)
                $('#customerContact').val(customer._contact)
                isFound=true;
                this.handelMiniAlert(customerId+' is found',isFound);
            }
        }
        if(!isFound){
            this.handelMiniAlert(customerId+' not found!',isFound);
        }
    }

    handelMiniAlert(msg,isFound){
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
        $('#customerId').val("");
        $('#customerName').val("");
        $('#customerAddress').val("");
        $('#customerContact').val("");
        $('#cusSearch').val("")
    }
}
new CustomerController();