export class Order{
    constructor(orderId, customer, itemArray, orderDate, discount, total, finalTotal) {
        this._orderId = orderId;
        this._customer = customer;
        this._itemArray = itemArray;
        this._orderDate = orderDate;
        this._discount = discount;
        this._total = total;
        this._finalTotal = finalTotal;
    }
    get orderId(){ return this._orderId}

    set orderId(orderId){ this._orderId = orderId}

    get customer(){ return this._customer}

    set customer(customer){ this._customer = customer}

    get itemArray(){ return this._itemArray}

    set itemArray(itemArray){ this._itemArray = itemArray}

    get orderDate(){ return this._orderDate}

    set orderDate(orderDate){ this._orderDate = orderDate}

    get discount(){ return this._discount}

    set discount(discount){ this._discount = discount}

    get total(){ return this._total}

    set total(total){ this._total = total}

    get finalTotal(){ return this._finalTotal}

    set finalTotal(finalTotal){ this._finalTotal = finalTotal}
}