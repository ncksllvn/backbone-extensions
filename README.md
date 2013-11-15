backbone-extensions
===================

Some of the classes that I found myself using semi-regularly while using Backbone.js.
    
    // Add 404 support
    Backbone.history = new Backbone.HistoryWith404();
    var router = new Backbone.RouterWith404({
        routes: {
            ''       : 'route0',
            'route1' : 'route1'
        }
    });
    
     router.on('statusCode:404', function(){
        alert('yay for 404 support!');
     });
     
     // cacheable collections/models - i found it useful for singleton classes being shared across files
     // with data that is unlikely change in each session
     var collection = new (Backbone.Cacheable.Collection.extend({ url: '/collection' }))();
     
     collection.fetch().done(function(){
        
        // an actual fetch is performed
        
        collection.fetch().done(function(){
            // the server isn't hit - the collection just returns its resolved promise (unless otherwise overridden)
            alert('hey, no server being hit!');
            
        });
        
     });
    
    