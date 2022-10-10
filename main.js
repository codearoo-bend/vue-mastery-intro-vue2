var eventBus = new Vue()

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

        <product-tabs :reviews="reviews" :premium="premium" :details="details" ></product-tabs>

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
            reviews: [],
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
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <!-- submit.prevent to prevent default action of page refreshing when hitting button. -->

        <p v-if="errors.length > 0">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="e in errors">
                    {{ e }}
                </li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>
    
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <label for="recommendation">Would you recommend this product?</label>
            <input type="radio" id="recommendationYes" name="recommendation" value="yes" v-model="recommendation">Yes
            <input type="radio" id="recommendationNo" name="recommendation" value="no" v-model="recommendation">No
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>

    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommendation: null,
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation,
                }
                eventBus.$emit( 'msg-review-submitted', productReview )
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            }
            else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommendation) this.errors.push("Recommendation required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array, required: true
        },
        premium: {
            type: Boolean, required: true
        },
        details: {
            type: Array, required: true
        },
    },
    template: `
    <div>
        <span class="tab"
            :class=" { activeTab: selectedTab === tab } "
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab = tab"
            >
            {{ tab }}
        </span>

        <div v-show=" selectedTab === 'Reviews' ">
            <h2>Reviews</h2>
            <p v-if=" reviews.length == 0 ">There are no reviews yet.</p>
            <ul>
                <li v-for="r in reviews">
                    <p>{{ r.name }}</p>
                    <p>Rating: {{ r.rating }}</p>
                    <p>Comments: {{ r.review }}</p>
                    <p>Would recommend: {{ r.recommendation }}</p>
                </li>
            </ul>
        </div>

        <product-review
            v-show=" selectedTab === 'Make a Review' "></product-review>

        <div v-show=" selectedTab === 'Shipping' ">
            <p>Shipping: {{ shipping }}</p>
        </div>

        <div v-show=" selectedTab === 'Details' " >
            <product-details :details="details"></product-details>
        </div>

    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
    mounted() {
        eventBus.$on( 'msg-review-submitted', review => {
            this.reviews.push( review )
        } )
    },
    computed: {
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