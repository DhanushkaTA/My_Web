import {OrderController} from "../controller/OrderController.js";
import {ItemController} from "./ItemController.js";
import {DashBoardController} from "./DashBoardController.js";

var hp=new DashBoardController();
hideAll();
$("#home").css("display","block")

$("#homeBtn").on("click",function (){
    hideAll();
    $("#home").css("display","block")
    hp.handleLabelDetails();
})

$("#logoBtn").on("click",function (){
    hideAll();
    $("#home").css("display","block")
    hp.handleLabelDetails();
})

$("#customerBtn").on("click",function (){
    hideAll();
    $("#customer").css("display","block")
})

$("#itemBtn").on("click",function (){
    hideAll();
    $("#item").css("display","block");
    ItemController.handleLoadItemRefresh();
})

$("#orderBtn").on("click",function (){
    hideAll();
    $("#order").css("display","block")
    OrderController.handleComboBox();
})

function hideAll(){
    $("#home,#customer,#order,#item").css({
        "display":"none"
    })
}