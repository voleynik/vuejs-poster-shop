var PRICE = 9.99; // vvo
var SHOW_NUM = 5;

console.log(Vue);
console.log('It works.');

new Vue({
    el: '#app',
    data: {
        total: 0,
        totalFound: [],
        items: [],
        cart: [],
        results: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods:{
        removeDuplicates: function(arrPosters){
            var arrPostersNoDuplicates = [];
            var arrTitles = [];
            for(var i = 0; i < arrPosters.length; i++){
                var onePoster = arrPosters[i];
                var posterTitle = onePoster["title"];
                if(arrTitles.indexOf(posterTitle) < 0){
                    arrPostersNoDuplicates.push(onePoster);
                    arrTitles.push(posterTitle);
                }
            }
            return arrPostersNoDuplicates;
        },
        onSubmit: function(){
            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(function(res){
                    this.totalFound = res.data;
                    this.lastSearch = this.newSearch;
                    var noDuplicates = this.removeDuplicates(res.data);
                    this.items = noDuplicates.slice(0, SHOW_NUM);//id: "xx",link: "https://i.imgur.com/NJWf0d3.jpg", title: "xx"
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
        },
        appendItems: function(){
            console.log('~appendItems()');
        }
    },
    filters: {
        currencyFilter: function(price){
            return "$".concat(price.toFixed(2));
        }
    },
    created: function(){
        console.log('~IN created');
    },
    mounted: function(){
        this.onSubmit();

        var vueInstance = this;
        var bottomElement = document.getElementById("product_list_bottom");
        var bottomWatcher = scrollMonitor.create(bottomElement);
        bottomWatcher.enterViewport(function(){
            vueInstance.appendItems();
        });

        console.log('~IN mounted');
    }
});