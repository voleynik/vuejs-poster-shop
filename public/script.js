var ITEM_PRICE = 9.99; // vvo
console.log('It works.');
console.log(Vue);

new Vue({
    el: '#app',
    data: {
        orderTotal: 0,
        itemsFound: [],
        cartItems: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        itemPrice: ITEM_PRICE
    },
    methods:{
        onSubmit: function(){
            //console.log('~newSearch: ' + this.newSearch);
            //console.log(this.$http);
            this.itemsFound = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res){
                    console.log(res.data);
                    this.lastSearch = this.newSearch;
                    this.itemsFound = res.data; // id: "xx",link: "https://i.imgur.com/NJWf0d3.jpg", title: "xx"
                    this.loading = false;
                });
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
        console.log('~IN mounted');
        this.onSubmit();
    }
});
