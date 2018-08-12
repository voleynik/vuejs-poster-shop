console.log('It works.');
console.log(Vue);

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [
            {title: 'Item 1', price: 7.99},
            {title: 'Item 2', price: 8.99},
            {title: 'Item 3', price: 9.99}
        ],
        cart: [],
        search: ''
    },
    methods:{
        onSubmit: function(){
            console.log('~search: ' + this.search);
            //console.log('$http: ' + this.$http);
        },
        dec: function(item){
            item.qty--;
            this.total -= item.price;
            if(item.qty <= 0){
                for(var i = 0; i < this.cart.length; i++) {
                    if(this.cart[i].title === item.title){
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },
        inc: function(item){
            item.qty++;
            this.total += item.price;
        },
        addItem: function(index){
            this.total += this.items[index].price;
            var item_found = false;
            for(var i = 0; i < this.cart.length; i++){
                if(this.items[index].title === this.cart[i].title){
                    item_found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if(!item_found){
                this.cart.push({
                    title: this.items[index].title,
                    qty: 1,
                    price: this.items[index].price
                });
            }
        }
    },
    filters: {
        currency: function(price){
            return "$".concat(price.toFixed(2));
        }
    }
});
