const PRICE = 9.99;
console.log('It works.');
console.log(Vue);

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods:{
        onSubmit: function(){
            //console.log('~newSearch: ' + this.newSearch);
            //console.log(this.$http);
            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res){
                    console.log(res.data);
                    this.lastSearch = this.newSearch;
                    this.items = res.data; // id: "xx",link: "https://i.imgur.com/NJWf0d3.jpg", title: "xx"
                    this.loading = false;
                });
        },
        dec: function(item){
            item.qty--;
            this.total -= PRICE;
            if(item.qty <= 0){
                for(var i = 0; i < this.cart.length; i++) {
                    if(this.cart[i].id === item.id){
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },
        inc: function(item){
            item.qty++;
            this.total += PRICE;
        },
        addItem: function(index){
            this.total += PRICE;
            var item_found = false;
            for(var i = 0; i < this.cart.length; i++){
                if(this.items[index].id === this.cart[i].id){
                    item_found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if(!item_found){
                this.cart.push({
                    id: this.items[index].id,
                    title: this.items[index].title,
                    qty: 1,
                    price: PRICE
                });
            }
        }
    },
    created: function(){
        console.log('~IN created');
    },
    mounted: function(){
        console.log('~IN mounted');
        this.onSubmit();
    },
    filters: {
        currencyFilter: function(price){
            return "$".concat(price.toFixed(2));
        }
    }
});
