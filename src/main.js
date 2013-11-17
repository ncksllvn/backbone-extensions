
/*
 * ncksllvn
 * a bunch of cool classes for Backbone that I kept finding myself using.
 * just include this file after Backbone
 */
 
 
 ~function(){
     
    Backbone.HistoryWith404 = (function(){
       
       var routers = [];
       
       HistoryWith404 = Backbone.History.extend({
 
            loadUrl: (function(loadUrl){
                return function(){
                    var match = loadUrl.apply(this, arguments);
                    var fragment = this.fragment;
                    if ( !match ){
                        _.chain(routers).compact().all(function(router){
                            router && router.trigger('statusCode:404', fragment);
                        });
                    }
                    return match;
                }
            })( Backbone.History.prototype.loadUrl )
            
        });
       
       Backbone.RouterWith404 = Backbone.Router.extend({
           constructor: (function(superConstructor){
                return function(){
                    superConstructor.apply(this, arguments);
                    routers.push(this);
                };
           })(Backbone.Router)
        });
        
        return HistoryWith404;
        
    })();
    
    Backbone.Cacheable = Backbone.Cacheable || {};
    
    Backbone.Cacheable.cachedFetch = function(fetch){
        return function(options){
            
            var _this = this;
            var callback;
            options = options || {};
                
            if ( !this.cache ){
                this.cache = fetch.call( this, {
                    success: function(){
                        _this.cache.outcome = 'success',
                        _this.cache.callbackArgs = arguments;
                        if (options.success) options.success.apply(window, arguments);
                    },
                    error: function(){
                        _this.cache.outcome = 'error',
                        _this.cache.callbackArgs = arguments;
                        if (options.error) options.error.apply(window, arguments);
                    }
                });
            }
            
            else{
                callback = options[ this.cache.outcome ];
                if ( callback ) callback.apply(window, this.cache.callbackArgs);
            }
            
            return this.cache;
        };
    };
    
    function hardFetch(){
        delete this.cache;
        return this.fetch();
    }
    
    _.extend( Backbone.Cacheable, {
        
        Collection: Backbone.Collection.extend({
            fetch: Backbone.Cacheable.cachedFetch( Backbone.Collection.prototype.fetch ),
            hardFetch: hardFetch
        }),
        
        Model: Backbone.Model.extend({
            fetch: Backbone.Cacheable.cachedFetch( Backbone.Model.prototype.fetch ),
            hardFetch: hardFetch
        })
        
    });

      
      
}();
 
