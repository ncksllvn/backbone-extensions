
/*
 * ncksllvn
 * a bunch of cool classes for Backbone that I kept finding myself using.
 * just include this file after Backbone
 */
 
 
 ~function(){
    
    Backbone.Cacheable = Backbone.Cacheable || {};
    
    Backbone.Cacheable.cachedFetch = function(fetch){
        return function(options){
            
            var _this = this, 
                options = options || {};
                
            if ( !this.cache ){
                this.cache = fetch.call( this, {
                    success: function(){
                        _this.cache.outcome = 'success',
                        _this.cache.callbackArgs = _.toArray(arguments);
                        if (options.success) options.success.apply(window, arguments);
                    },
                    error: function(){
                        _this.cache.outcome = 'error',
                        _this.cache.callbackArgs = _.toArray(arguments);
                        if (options.error) options.error.apply(window, arguments);
                    }
                });
                return this.cache;
            }
            
            else{
                var callback = options[ this.cache.outcome ];
                var args = this.cache.callbackArgs;
                if ( callback ) callback.apply(window, args);
                return this.cache;
            }
            
        };
    };
    
    _.extend( Backbone.Cacheable, {
        
        Collection: Backbone.Collection.extend({
            fetch: Backbone.Cacheable.cachedFetch( Backbone.Collection.prototype.fetch )
        }),
        
        Model: Backbone.Model.extend({
            fetch: Backbone.Cacheable.cachedFetch( Backbone.Model.prototype.fetch )
        })
        
    });

      
      
}();
 
