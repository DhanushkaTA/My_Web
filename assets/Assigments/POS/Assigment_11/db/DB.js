
var cusData = "DATA";
var itemData = "ITEM";
var orderData = "ORDER";

export function getAllDB(data){

    let pre_data = localStorage.getItem(data);
    let data_array = [];
    if (pre_data) {
        data_array = JSON.parse(pre_data);
    }
    return data_array ;
}
export function saveCustomerDB(customer){

    let data_array = getAllDB(cusData);

    data_array.push(customer);

    localStorage.setItem(cusData, JSON.stringify(data_array));
}
export function updateCustomerDB(customer){

    let data_array = getAllDB(cusData);

    let index = getAllDB(cusData).findIndex(value => value._id === customer._id);

    data_array[index] = customer;

    localStorage.setItem(cusData, JSON.stringify(data_array));
}
export function deleteCustomerDB(customer){

    let data_array = getAllDB(cusData);

    let index = getAllDB(cusData).findIndex(value => value._id === customer._id);

    data_array.splice(index, 1);

    localStorage.setItem(cusData, JSON.stringify(data_array));
}
export function saveItemDB(item){

    let data_array = getAllDB(itemData);

    data_array.push(item);

    localStorage.setItem(itemData, JSON.stringify(data_array));
}
export function updateItemDB(item){

    let data_array = getAllDB(itemData);

    let index = getAllDB(itemData).findIndex(value => value._itemCode === item._itemCode);

    data_array[index] = item;

    localStorage.setItem(itemData, JSON.stringify(data_array));
}
export function deleteItemDB(item){

    let data_array = getAllDB(itemData);

    let index = getAllDB(itemData).findIndex(value => value._itemCode === item._itemCode);

    data_array.splice(index, 1);

    localStorage.setItem(itemData, JSON.stringify(data_array));
}
export function saveOrderDB(order){

    let data_array = getAllDB(orderData);

    data_array.push(order);

    localStorage.setItem(orderData, JSON.stringify(data_array));
}