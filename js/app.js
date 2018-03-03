var app=angular.module("groceryListApp", ["ngRoute"]);

app.config(['$routeProvider',function($routeProvider)
{
$routeProvider.when("/",{
    templateUrl:"views/GroceryList.html",
    controller:"GroceryListItemsController as gctrl"
  })


  .when("/addItem",{
    templateUrl:"views/addItem.html",
    controller:"GroceryListItemsController as gctrl"
  })

  .when("/addItem/edit/:id/",{
    templateUrl:"views/addItem.html",
    controller:"GroceryListItemsController as gctrl"

  })
    .otherwise({redirectTo: '/'});
}]);

app.controller("HomeController",["GroceryService",function(GroceryService){

  this.appTitle="Grocery List";
}]);

app.controller("GroceryListItemsController",["$routeParams","GroceryService","$location",function($routeParams,GroceryService,$location){

  this.groceryItems= GroceryService.groceryItems;
  if(!$routeParams.id){ /* A new item should only be initialized when we add an item and not edit one. Editing an item passes id as routeParams
                        so if there is no routeParams (which means we clicked on save) routeParams.id evaluates to null. and not of null evaluates to true in js */
    this.groceryItem ={id:0, completed:true, itemName: '', date: new Date() };
  }
  else{
    this.groceryItem= _.clone(GroceryService.findById(parseInt($routeParams.id)));
  }
  this.save = function()
  {
    GroceryService.save(this.groceryItem);
    $location.path("/");
  }

  this.removeItem= function(entry)
  {
    GroceryService.removeItem(entry);
  }
  console.log(GroceryService);

  this.markCompleted = function(entry)
  {
    GroceryService.markCompleted(entry);
  }


}]);

app.service("GroceryService",[function(){
  var groceryService= {};

  groceryService.groceryItems= [

    {id:1, completed: false, itemName: 'milk' ,      date : new Date("October 1 2014 11:23:00")},
    {id:2, completed: false, itemName: 'chocolate' , date : new Date("October 5 2014 16:23:00")},
    {id:3, completed: false, itemName: 'beer' ,      date : new Date("October 21 2014 11:22:00")},
    {id:4, completed: false, itemName: 'yogurt' ,    date : new Date("October 12 2014 14:23:00")},
    {id:5, completed: false, itemName: 'crisps' ,    date : new Date("October 18 2014 01:26:00")},
  ];
  groceryService.save= function(entry)
  {
    var updatedItem=groceryService.findById(entry.id);
    if(updatedItem){
      updatedItem.completed=entry.completed;
      updatedItem.itemName= entry.itemName;
      updatedItem.date= entry.date;
    }
    else{
      entry.id= groceryService.getNewId();
      groceryService.groceryItems.push(entry);
    }
  }
  groceryService.getNewId = function(){
    if(groceryService.newId){
      groceryService.newId++;
      return groceryService.newId;
    }

    else{
      var maxId= _.max(groceryService.groceryItems, function(entry){ return entry.id;});
      groceryService.newId=maxId.id +1;
      return groceryService.newId;
    }
  }

  groceryService.findById= function(id){
    for(var item in groceryService.groceryItems)
    {
      if(groceryService.groceryItems[item].id== id)
      {
        return groceryService.groceryItems[item];
      }

    }

  }

  groceryService.removeItem = function(entry)
  {
    var index= groceryService.groceryItems.indexOf(entry);
    groceryService.groceryItems.splice(index,1);
  }

  groceryService.markCompleted= function(entry)
{

  entry.completed= !entry.completed;
}

  return groceryService;


}])
