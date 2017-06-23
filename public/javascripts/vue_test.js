'use strict';

//TODO use calculated methods for quote.price
//TODO add a total status at top of all quotes

Vue.component('confirm-button', {
    template: `
      <div>
        <span v-if="approved">Sure?
          <button v-on:click="on_delete" v-focus >Yes</button>
          <button v-on:click="approved = false">No</button>
        </span>
        <span v-else>
            <button v-on:click="approved = true">Delete</button>
        </span>
      </div>
    `,
    directives: {
        focus: {
            inserted: function(el) {
                el.focus();
            }
        }
    },
    props: {
        on_delete: {
            type: Function,
            required: true
        }
    },
    data: function() {
        return { approved: false };
    }
});

Vue.component('quote', {
    template: `
      <div class="well row">
        <template v-if="!editing">
          <div class="col-xs-5">
            <span>{{q.created}} | {{q.description}}</span>
            <div v-for="item in q.quote_items" class="row">
              <div class="col-xs-1"></div>
              <div class="col-xs-3">{{item.name}}</div>
              <div class="col-xs-8">\${{item.price}}</div>
            </div>
          </div>
          <div class="col-xs-3">
            <span>\${{q.price}}</span>
          </div>
        </template>

        <template v-else>
          <div class="col-xs-5">
            <input v-model="q.description">
            <div v-for="item in q.quote_items" class="row">
              <div class="col-xs-1"></div>
              <div class="col-xs-3"><input v-model="item.name"></div>
              <div class="col-xs-8">\$<input v-model="item.price" type="number" step="0.01" ></div>
            </div>
          </div>
          <div class="col-xs-3">
            <span>\${{quote_total}}</span>
          </div>
        </template>

        <div class="col-xs-4">
          <button v-on:click="set_editing">{{edit_text}}</button>
          <button v-if="editing" v-on:click="save_edit">Save</button>
          <confirm-button v-bind:on_delete="delete_row" >Delete</confirm-button>
        </div>
      </div>`,
    props: ['quote'],
    data: function() {
        //bind 'quote' as local 'q' since not supposed to change prop data
        return { q: this.quote, editing: false, edit_text: 'Edit' };
    },
    computed: {
        quote_total: function() {
            var quote_total = this.q.quote_items.reduce((total, val) => total + val.price * 1, 0);
            return rnd(quote_total);
        }
    },

    methods: {
        set_editing: function() {
            this.q.price = this.quote_total;
            this.editing = !this.editing;
            this.edit_text = this.editing ? 'Cancel' : 'Edit';
        },
        delete_row: function() {
            console.log('delete me hit');
            var context = this;

            axios
                .delete('/api/quote/' + this.q.id)
                .then(function(response) {
                    console.log(response);
                    context.$emit('delete-row', context.q);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        save_edit: function() {
            var context = this;

            axios
                .post('/api/quote/' + this.q.id, this.q)
                .then(function(response) {
                    console.log(response);
                    context.set_editing();
                    context.$emit('save-edit', context.q);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
});

Vue.component('quotes', {
    template: `
      <div class="container">
        <div class="row">
          <div class="col-xs-3"></div>
          <div class="col-xs-3"><h4>Quotes: {{ total_quotes }}</h4></div>
          <div class="col-xs-3"><h4>Quote items: {{ total_quote_items }}</h4></div>
          <div class="col-xs-3"><h4>Total: \${{ total_price }}</h4></div>
        </div>

        <quote v-for="q in quotes" v-bind:quote="q" :key="q.id" v-on:save-edit="update_quote" v-on:delete-row="delete_quote"></quote>
      </div>`,

    props: ['quotes'],
    computed: {
        total_quotes: function() {
            return this.quotes.length;
        },
        total_quote_items: function() {
            var total = 0;
            this.quotes.forEach(function(quote) {
                total = total + quote.quote_items.length;
            });
            return total;
        },
        total_price: function() {
            var quote_total = this.quotes.reduce((total, val) => total + val.price * 1, 0);
            return rnd(quote_total);
        }
    },
    methods: {
        update_quote: function(quote) {
            //catch and rethrow save-edit event
            this.$emit('save-edit', quote);
        },
        delete_quote: function(quote) {
            //catch and rethrow
            this.$emit('delete-row', quote);
        }
    }
});

Vue.component('new-quote', {
    template: `
        <form v-on:submit.prevent="onSubmit">
            <h4>New Quote</h4>
            <hr>
            <div class="form-group">
                <label for="qdescription">Description</label>
                <input
                    required
                    type="text"
                    id="qdescription"
                    class="form-control"
                    v-model="description">
                <p>Quote Total: \${{ quote_total }}</p>
            </div>

            <div class="form-group">

                <div class="row">
                    <div class="col-xs-3"><h4>Quote Items:</h4> </div>
                    <div class="col-xs-9">
                        <button class="btn btn-primary" v-on:click.prevent="add_item">Add Quote Item</button>
                    </div>
                </div>
                <hr>
                <div v-for="(item,index) in quote_items" class="row">
                    <div class="col-xs-3">
                        <label :for="'name_' + index">{{index + 1}}. Name</label>
                        <input
                            required
                            type="text"
                            :id="'name_' + index"
                            class="form-control"
                            placeholder="Item"
                            v-model="item.name">
                    </div>
                    <div class="col-xs-3">
                        <label :for="'price_' + index">Price</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            :id="'price_' + index"
                            class="form-control"
                            v-model="item.price">
                    </div>
                </div>
            </div>
            <button class="btn btn-primary" type="submit">Save Quote</button>
        </form>`,
    data: function() {
        return { description: '', price: 0, quote_items: [{ name: '', price: 0 }] };
    },
    computed: {
        quote_total: function() {
            var quote_total = this.quote_items.reduce((total, val) => total + val.price * 1, 0);
            return rnd(quote_total);
        }
    },

    methods: {
        onSubmit: function(e) {
            console.log(e);
            var context = this;

            axios
                .post('/api/quote', {
                    description: this.description,
                    price: this.quote_total,
                    quote_items: this.quote_items
                })
                .then(function(response) {
                    console.log('worked');
                    console.log(response);
                    context.$emit('grid-change');

                    context.description = '';
                    context.price = 0;
                    context.quote_items = [{ name: '', price: '' }];
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        add_item: function() {
            this.quote_items.push({ name: '', price: 0 });
        }
    }
});

new Vue({
    el: '#root',
    data: { quotes: [] },

    mounted: function() {
        this.get_quotes();
    },

    methods: {
        get_quotes: function() {
            var context = this;
            axios
                .get('/api/quote')
                .then(function(response) {
                    console.log('worked');
                    console.log(response);
                    context.quotes = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        new_quote: function() {
            this.get_quotes();
        },
        update_quote: function(quote) {
            var i = this.quotes.findIndex(old_quote => {
                return old_quote.id === quote.id;
            });
            if (!/\(edited\)$/.test(quote.description)) {
                quote.description = quote.description + ' (edited)';
            }
            this.quotes.splice(i, 1, quote);
        },
        delete_quote: function(quote) {
            var i = this.quotes.findIndex(old_quote => {
                return old_quote.id === quote.id;
            });
            this.quotes.splice(i, 1);
        }
    }
});

function rnd(value) {
    return Number(Math.round(value + 'e2') + 'e-2').toFixed(2);
}
