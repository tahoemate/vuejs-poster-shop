// console.log(Vue);

var MAXLOAD = 10;

new Vue ({
    el: "#app",
    data : {
        total: 0,
        results: [],    // full results from server
        items: [        // overwitten by search
            { id: 1, title: 'Records', price: 1.50, photo: '' },
            { id: 2, title: 'Vibrators', price: 2.50, photo: '' },
            { id: 3, title: 'Ben Wa Balls', price: 3.50, photo: '' }
            ],
        cart: [],
        term: 'anime',
        lastterm: 'anime'
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
        search: function () {
            // console.log(this.$http);
            this.items = [];  // empty array
            this.$http
                .get( '/search/'.concat(this.term))
                .then( function(res) {
                    // console.log(res);
                    this.results = [];  // empty array
                    // populate items - fudge price value
                    res.data.forEach( item => { 
                        this.results.push({id: item.id, title: item.title, price: item.height/100, photo: item.link}); 
                    });  
                    console.log('# items: ' + this.results.length);
                    this.appendItems();

                    this.lastterm = this.term;
                });
        },
        appendItems: function () {  // make sure to use slice not splice
            // console.log('appendItems 1');
            // console.log( 'IL: '+ this.items.length + '  RL: ' + this.results.length);
            if (this.items.length < this.results.length) {
                // console.log('appendItems 2');
                var idx = this.items.length;
                this.items = this.items.concat(this.results.slice(idx,idx+MAXLOAD)); // slice(start,end)
                // console.log( 'IL: '+ this.items.length + '  RL: ' + this.results.length);
            }
        }
    },
    filters: {
        currency: function (price) {
            // weird bug where price has to be parsed.
            return '$'.concat(parseFloat(price).toFixed(2));
        }
    },
    mounted: function () {  // lifecycle hook
        this.search();

        var self = this;  // for use in scrollMonitor function below.

        // console.log(scrollMonitor);
        // https://github.com/stutrek/scrollMonitor
        // The code is vanilla javascript and has no external dependencies, 
        // however the script cannot be put in the head.
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport( function () { 
            // console.log('enter viewport'); 
            self.appendItems();
        });
        // watcher.exitViewport( function () { console.log('exit viewport') });

    },
})

