

var userId = "buyer";
var data;

var ongoingButtonIds = [];
var awaitingButtonIds = [];
var finishedButtonIds = [];

var ongoingBoxIds = [];
var awaitingBoxIds = [];
var finishedBoxIds = [];
var failedBoxIds = [];

init();

function init() {

    document.getElementById("errorBox").setAttribute("hidden", true);

    ongoingButtonIds = [];
    awaitingButtonIds = [];
    finishedButtonIds = [];

    ongoingBoxIds = [];
    awaitingBoxIds = [];
    finishedBoxIds = [];
    failedBoxIds = [];

    otherOffersAcceptButtonId = [];
    otherOffersBoxId = [];
    // get all the offer of a ceratin post
    data = getAll().result;
    // show the current accepted offer
    
    // show the offers list
    bindList("ongoing");
    bindList("awaiting");
    bindList("finished");
    bindList("failed");

}


function getAll() {
    var result;
    $.ajax({
        methods: "get",
        url:'/offers/mySent/'+userId,
        cache: false,
        async: false,
        success: function (data) {
        result = data}
    })
    return result;
}

function getImage(tagName,imgName){
    document.getElementById(tagName).src = "images/"+imgName;
}

function bindList(elementId){

    var products = document.getElementById(elementId); //找到tbody标签
    
    var subData = [];
    if(elementId == "ongoing"){
        for(i=0;i<data.length;i++){
            if(data[i].status == 1){
                subData.push(data[i]);
            }
        }
    }else if(elementId == "awaiting") {
        for(i=0;i<data.length;i++){
            if(data[i].status == 0 || data[i].status == -1){
                subData.push(data[i]);
            }
        }
    }else if(elementId == "finished"){
        for(i=0;i<data.length;i++){
            if(data[i].status == 2){
                subData.push(data[i]);
            }
        }
    }else{
        for(i=0;i<data.length;i++){
            if(data[i].status == -2){
                subData.push(data[i]);
            }
        }
    }

    for (var i = 0; i < subData.length; i++) { //对stus进行循环遍历，并建立tr标签
        id = subData[i]._id;
        confirmByBuyer = subData[i].confirmByBuyer;
        // console.log(elementId,id);
        var div1 = document.createElement('div');

        
        
        div1.className = "product";
        products.appendChild(div1);
        var div2 = document.createElement('div');
        div2.className = "product-under";
        div1.appendChild(div2);

        figure = document.createElement("figure");
        figure.className = "product-image";
        div2.appendChild(figure);


        imgName = subData[i].imgName;
        img = document.createElement("img");
        img.src = "images/"+imgName;
        img.alt=subData[i].offerItem;
        figure.appendChild(img);

        div3 = document.createElement("div");
        div3.className = "product-over";
        figure.appendChild(div3);
        
        if(elementId=="ongoing"){

            boxId = "boxId" + i;
            ongoingBoxIds.push(boxId);
            div1.setAttribute("id",boxId);



            ButtonId = "confirmButton" + i;
            ongoingButtonIds.push(ButtonId);
            button = document.createElement("button");
            // button.id = acceptButtonId;
            button.setAttribute("id",ButtonId);
            button.className = "btn-small-accept";
            button.innerHTML = "Confirm";
            if(confirmByBuyer == 1){
                button.className = "btn-small-banned";
                button.setAttribute("disabled", "disabled");
                button.innerHTML = "You have confirmed";
            }
            
            myId = document.createAttribute("myid");
            myId.nodeValue = id;
            button.attributes.setNamedItem(myId);

            button.onclick = function(){
                
                $.ajax({
                    type: "put",
                    url: "/offers/status/confirmByBuyer/"+ this.getAttribute("myid"),
                    cache: false,
                    async: false,
                    success: function (data) {
                        // console.log(data)

                        // alert(data.result);
                        // document.getElementById("zone1").removeChild(document.getElementById("ongoing"));
                        // products = document.createElement("div");
                        // products.className = "products";
                        // products.setAttribute("id","ongoing");
                        // document.getElementById("zone1").appendChild(products);
                        if(data.code == 200){
                            for(i=0;i<ongoingBoxIds.length;i++){
                            document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
                            }
                            for(i=0;i<awaitingBoxIds.length;i++){
                                document.getElementById("awaiting").removeChild(document.getElementById(awaitingBoxIds[i]));
                            }
                            for(i=0;i<finishedBoxIds.length;i++){
                                document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
                            }
                            for(i=0;i<failedBoxIds.length;i++){
                                document.getElementById("failed").removeChild(document.getElementById(failedBoxIds[i]));
                            }

                            button.className = "btn-small-banned";
                            button.setAttribute("disabled", "disabled");
                            button.innerHTML = "You have confirmed";
                            init();
                        }
                    },
                    error: function (data) {
                        
                        errorBox = document.getElementById("errorBox");

                        errorBox.removeAttribute("hidden");
                        errorBox.setAttribute("display", true);
                        errorBox.innerHTML = data.responseJSON.result;
                        span = document.createElement("span");
                        span.innerHTML = "×";
                        span.className = "close";
                        span.onclick = "this.parentElement.style.display='none';";
                        errorBox.appendChild(span);
                        
                    }
                })
            };
            div3.appendChild(button);
        } else if (elementId=="awaiting"){

            boxId = "boxId" + i;
            awaitingBoxIds.push(boxId);
            div1.setAttribute("id",boxId);

            editbutton = document.createElement("a");
            editbutton.className = "btn-small-accept";
            editbutton.innerHTML = "Edit";
            editbutton.href = '/offers/page/edit/'+id;
            div3.appendChild(editbutton);

            
            deletebutton = document.createElement("button");
            deletebutton.className = "btn-small-accept";
            deletebutton.innerHTML = "Delete";

            myId = document.createAttribute("myid");
            myId.nodeValue = id;
            deletebutton.attributes.setNamedItem(myId);

            deletebutton.onclick = function(){
                $.ajax({
                    type: "delete",
                    url: "/offers/offer/"+this.getAttribute("myid"),
                    cache: false,
                    async: false,
                    success: function (data) {

                        

                        for(i=0;i<ongoingBoxIds.length;i++){
                            document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
                        }
                        for(i=0;i<awaitingBoxIds.length;i++){
                            document.getElementById("awaiting").removeChild(document.getElementById(awaitingBoxIds[i]));
                        }
                        for(i=0;i<finishedBoxIds.length;i++){
                            document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
                        }
                        for(i=0;i<failedBoxIds.length;i++){
                            document.getElementById("failed").removeChild(document.getElementById(failedBoxIds[i]));
                        }
                        init();
                    },
                    error: function (data) {
                        
                        errorBox = document.getElementById("errorBox");

                        errorBox.removeAttribute("hidden");
                        errorBox.setAttribute("display", true);
                        errorBox.innerHTML = data.responseJSON.result;
                        span = document.createElement("span");
                        span.innerHTML = "×";
                        span.className = "close";
                        span.onclick = "this.parentElement.style.display='none';";
                        errorBox.appendChild(span);
                    }
                })
            };
            div3.appendChild(deletebutton);
        } else if (elementId=="finished"){
            boxId = "boxId" + i;
            finishedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        } else{
            boxId = "boxId" + i;
            failedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        }
    
        

        a = document.createElement("a");
        a.href = "/offers/offer/"+id;
        a.className = "btn-small-accept";
        a.innerHTML = "Offer Details";
        div3.appendChild(a);

        div4 = document.createElement("div");
        div4.className = "product-summary";
        div2.appendChild(div4);

        h4 = document.createElement("h4");
        h4.className = "productName";
        h4.innerHTML = subData[i].offerItem;
        div4.appendChild(h4);

        span = document.createElement("span");
        span.className = "stars";
        div4.appendChild(span);

        p = document.createElement("p");
        p.innerHTML = subData[i].itemDesc;
        div4.appendChild(p);
    }
}