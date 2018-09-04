var ITEM_PRICE = 9.99; // vvo - replace OLD
var APPEND_NUM = 5;
console.log('It works.');
console.log(Vue);

// id: "xx",link: "https://i.imgur.com/NJWf0d3.jpg", title: "xx"

new Vue({
    el: '#app',
    data: {
        orderTotal: 0,
        itemsFound: [],
        itemsShown: [],
        cartItems: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        itemPrice: ITEM_PRICE
    },
    computed: {
        noMoreItemsToAppend: function() {
            return this.itemsFound.length === this.itemsShown.length && !this.loading;
        }
    },
    methods: {
        onSubmit: function(){
            if(this.newSearch.length < 1){
                return;
            }
            this.itemsFound = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res){
                    console.log("~res: " + res);
                    console.log(res.data);
                    this.lastSearch = this.newSearch;
                    this.itemsFound = this.removeDuplicates(res.data);
                    this.itemsShown = this.itemsFound.slice(0, APPEND_NUM);
                    this.loading = false;
                });
        },
        appendItems: function(){
            if(this.itemsShown < this.itemsFound){
                var itemsShownLength = this.itemsShown.length;
                var itemsToAppend = this.itemsFound.slice(itemsShownLength, itemsShownLength + APPEND_NUM);
                this.itemsShown = this.itemsShown.concat(itemsToAppend);;
            }
        },
        removeDuplicates: function(arrPosters){
            var arrPostersNoDuplicates = [];
            var arrTitles = [];
            for(var i = 0; i < arrPosters.length; i++){
                var onePoster = arrPosters[i];
                var posterTitle = onePoster["title"];
                posterTitle = posterTitle.replace("  ", " ");
                if(arrTitles.indexOf(posterTitle) < 0){
                    arrPostersNoDuplicates.push(onePoster);
                    arrTitles.push(posterTitle);
                }
            }
            return arrPostersNoDuplicates;
        },
        dec: function(item){
            item.qty--;
            this.orderTotal -= ITEM_PRICE;
            if(item.qty <= 0){
                for(var i = 0; i < this.cartItems.length; i++) {
                    if(this.cartItems[i].id === item.id){
                        this.cartItems.splice(i, 1);
                        break;
                    }
                }
            }
        },
        inc: function(item){
            item.qty++;
            this.orderTotal += ITEM_PRICE;
        },
        addItem: function(index){
            this.orderTotal += ITEM_PRICE;
            var item_found = false;
            for(var i = 0; i < this.cartItems.length; i++){
                if(this.itemsFound[index].id === this.cartItems[i].id){
                    item_found = true;
                    this.cartItems[i].qty++;
                    break;
                }
            }
            if(!item_found){
                this.cartItems.push({
                    id: this.itemsFound[index].id,
                    title: this.itemsFound[index].title,
                    qty: 1,
                    price: ITEM_PRICE
                });
            }
        }
    },
    filters: {
        currencyFilter: function(money){
            return "$".concat(money.toFixed(2));
        }
    },
    created: function(){
        console.log('~IN created');
    },
    mounted: function(){
        this.onSubmit();
        var vueInstance = this;
        var prodButtom = document.getElementById("product-list-bottom");
        var watcher = scrollMonitor.create(prodButtom);
        watcher.enterViewport(function(){
            vueInstance.appendItems();
        });
    }
});


