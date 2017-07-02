// console.log(Vue);

new Vue ({
    el: "#app",
    data : {
        total: 0,
        items: [  // overwitten by search
            { id: 1, title: 'Records', price: 1.50, photo: '' },
            { id: 2, title: 'Vibrators', price: 2.50, photo: '' },
            { id: 3, title: 'Ben Wa Balls', price: 3.50, photo: '' }
            ],
        cart: [],
        term: 'anime',
        lastterm: ''
    },
    methods : {
        addItem: function (idx) {
            // console.log(idx + ' ' + this.items[idx].price);
            this.total += this.items[idx].price;
            var item = this.items[idx];
            for ( var ix=0; ix < this.cart.length; ix++) {  
                if (this.cart[ix].id == item.id) {
                    this.cart[ix].qty++;
                    break;
                }
            }
            if (ix == this.cart.length ) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: item.price
                });
            }
        },
        inc_cart : function(item) { console.log('inc'); item.qty++; this.total += item.price },
        dec_cart : function(item) {
            console.log('dec'); 
            item.qty--; 
            this.total -= item.price
            if( item.qty <= 0) { 
                for(var ix = 0; ix < this.cart.length; ix++) {
                    if( this.cart[ix].id == item.id) {
                        this.cart.splice(ix,1);
                        break;
                    }
                }
            }
        },
        search : function () {
            // console.log(this.$http);
            this.items = [];  // empty array
            this.$http
                .get( '/search/'.concat(this.term))
                .then( function(res) {
                    // console.log(res);
                    this.items = [];  // empty array
                    // populate items
                    res.data.forEach( item => { this.items.push({id: item.id, title: item.title, price: item.height/100, photo: item.link}); } );  // Fudge price value
                    this.lastterm = this.term;
                });
        }
    },
    filters: {
        currency: function (price) {
            // weird bug where price has to be parsed.
            return '$'.concat(parseFloat(price).toFixed(2));
        }
    },
    mounted: function () {
        this.search();
    },
})
