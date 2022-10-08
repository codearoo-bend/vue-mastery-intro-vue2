Vue.component('product-details', {
    props: {
        details: {
            type: Array, require: true
        }
    },

    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `,
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {
        
    }
})

Vue.component('product', {

    props: {
        premium: {
            type: Boolean, required: true
        }
    },

    template: `
    <div class="product">
        <div class="product-image">
            <!-- <img v-bind:src="image"> -->
            <img :src="image">
            <p>{{ onSaleText }}</p>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>

            <product-details :details="details"></product-details>


            <div v-for="(v, i) in variants" :key="v.id" class="color-box" :style="{ backgroundColor: v.color }"
                @mouseover="updateProduct( i )">
            </div>

            <!-- <div v-for="s in sizes">
                <p>{{ s }}</p>
            </div> -->
        </div>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to
            Cart</button>
        <button @click="removeFromCart">Remove from Cart</button>

    </div>

    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                { id: 2234, qty: 10, color: "green", image:"https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg" },
                { id: 2235, qty: 1, color: "blue", image:"https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg" }
            ],
            sizes: [ "small", "medium", "large" ],
        }
    },
    methods: {
        addToCart() {
            // this.cart += 1
            // publish this event
            this.$emit('msg-add-to-cart', this.variants[ this.selectedVariant ].id )
        },
        removeFromCart() {
            // this.cart -= 1
            this.$emit( 'msg-remove-from-cart', this.variants[ this.selectedVariant ].id )
        },
        updateProduct( i ) {
            this.selectedVariant = i
            // console.log( i )
        },
    },
    // computed properties are cached
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[ this.selectedVariant ].image
        },
        inStock() {
            return this.variants[ this.selectedVariant ].qty
        },
        onSaleText() {
            if ( this.onSale ) { return this.title + ' is on sale!' }
        },
        shipping() {
            if (this.premium) { return "Free" }
            else { return 2.99 }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        addToCard( id ) {
            this.cart.push( id );
            console.log( this.cart );
        },
        // removes from cart all instances of the given ID.
        removeFromCart( id ) {
            this.cart = this.cart.filter( x => x !== id );
            console.log( this.cart );
        }
    }
})