

// set up the fake server to respond to fetch requests
var server = sinon.fakeServer.create();
var serverRequestCount = 0;

server.respondWith('GET', '/collection', function(xhr){
    serverRequestCount++;
    xhr.respond( 200, { "Content-Type": "application/json" },
        JSON.stringify([ {id: 1, name: 'obj1'}, {id: 2, name: 'obj2'}, {id: 3, name: 'obj3'} ])
    );
});

server.autoRespond = true;

module('Test the Backbone.Cacheables');
asyncTest('Make sure there is network activity on the first call to fetch, then on the second call to fetch seamlessly return the collection.', function(){
    expect(12)
    var collection = new (Backbone.Cacheable.Collection.extend({ url: '/collection' }))()
    var response, options;
    var successCallback = sinon.spy(function(a, b, c){
        response=b, options=c;
    });
    
    function runAssertions(data, textStatus, jqXHR){
        deepEqual( data, collection.toJSON(), 'The promise callback was passed the right JSNON data.');
        equal( textStatus, 'success', 'The promise was passed the right text status.');
        ok( jqXHR.promise(), 'The promise was passed a jqXHR object.');
        ok( successCallback.calledWith(collection, response, options), 'The success callback was fired with the right arguments.');
        response = null, options = null;
    }
    
    function fetchDataFromTheServer(){
        strictEqual( serverRequestCount, 1, 'Collection has successfully fetched data from the server and a promise was returned.');
        ok( successCallback.calledOnce, 'The success callback was fired.')
    }
    
    function fetchDataFromCache(){
        strictEqual( serverRequestCount, 1, 'Fetch was called, but the server was not hit and instead the collection responded with the cache.');
        ok( successCallback.calledTwice, 'The success callback was fired again.')
    }
    
    // should hit the server this time
    collection
        .fetch({ success: successCallback })
        .done(fetchDataFromTheServer)
        .done(runAssertions)
        .done(function(){
            
            // shouldn't hit the server this time
            collection
                .fetch({ success: successCallback })
                .done(fetchDataFromCache)
                .done(runAssertions)
                .done(start)
            
        })
});

module('Test the 404 Handler on the History')
asyncTest('Make sure routers fire off a 404 event', function(){
    
    expect(5)
    
    Backbone.history = new Backbone.HistoryWith404();
    
    var router = new Backbone.RouterWith404({
        routes: {
            ''       : 'route0',
            'route1' : 'route1',
            'route2' : 'route2'
        }
    });
    
    
    var callback = sinon.spy();
    
    router.on('route:route0', callback);
    router.on('route:route1', callback);
    router.on('route:route2', callback);
    router.on('statusCode:404', callback);
    
    document.location.hash=''
    Backbone.history.start({ root: document.location.pathname });
    
    ok( callback.calledOnce, 'First route triggered.');
    
    router.navigate('route1', { trigger: true });
    ok( callback.calledTwice, 'Second route triggered.');
    
    router.navigate('route2', { trigger: true });
    equal( callback.callCount, 3, 'Third route triggered.');
    
    router.navigate('noRouteForThis', { trigger: true });
    equal( callback.callCount, 4, '404 route triggered.');
    ok( callback.calledWith('noRouteForThis'), 'The 404 handler was fired with the right arguments.');
    
    start();

});
























