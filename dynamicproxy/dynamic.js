(function(){
    var interceptors = {};
    $.intercept = function(name, func){

        var parts = name.split('.');
        var owner = window;

        console.log("name == " + name + "   func == " + func.toString() + "   parts == " + parts.toString())
        for (var i = 0; i < parts.length - 1; i++){
            owner = owner[parts[i]];
            if (!owner) break;
        }
        if (owner){
            var funcName = parts[parts.length - 1];
            var target = owner[funcName];
        }

        if (owner && target) {
            console.log("owner == " + owner.toString() + "  target == " + target.toString())
        }

        if (!(owner && target)){
            interceptors[name] = func;

            console.log("interceptors[name] == " + interceptors[name].toString())
            return;
        }
        console.log("owner[funcName] == " + owner[funcName].toString())

        owner[funcName] = function(){
            this.__invocation__ = target;
            func.apply(this, arguments)
        }
    }

    $._ = function(name, func, scope, args){
        var interceptor = interceptors[name];
        console.log("name == " + name + "  func == " + func + "  scope == " + scope + "  args == " + args + "  interceptor == " + interceptor);
        if (interceptor){
            scope = scope || window;
            scope.__invocation__ = func;
            interceptor.apply(scope, args || []);
            // return interceptor.apply(scope, args || []);
        }
        func.apply(scope, args || []);

        // else {
        //     return func.apply(scope, args || []);
        // }
    }

})()