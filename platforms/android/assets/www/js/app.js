// Ionic Starter App

//Modulo de la pagina de la app. Requiere el modulo Ionic
angular.module('starter', ['ionic'])

  //Creamos un servicio. Listas es el array de listas.
  .factory('listas', function() {
    //Devolvemos:
    return {
      //Todas las listas
      all: function() {
        //Recuperamos del localstorage un string con todas las listas. Es un array de objetos en una string
        var listaString = window.localStorage['listas'];
        //Si hay algo
        if(listaString) {
          //Convertimos el string a un JSON y lo devolvemos a la vista. En listas ahora tenemos el JSON
          return angular.fromJson(listaString);
        }
        //Sino, devolvemos un array vacio
        return [];
      },
      //Guardamos las listas
      save: function(listas) {
        //Almacenamos las listas en LocalStorage, convirtiendolo a string con angular.toJson (inverso a angular.fromJson)
        console.log('FACTORY Entramos en save');
        window.localStorage['listas'] = angular.toJson(listas);
      },
      nuevaLista: function(listaTitle) {
        // Añadimos una nueva lista
        console.log('FACTORY Añadimos una nueva lista');
        return {
          title: listaTitle,
          backup_title: listaTitle,
          sublistas: [],
          tasks: [],
          gasto: 0,
          gasto_total: 0
        };
      },
      //Recuperamos la ultima lista activa
      getLastActiveIndex: function() {
        return parseInt(window.localStorage['lastlistaActiva']) || 0;
      },
      //Establecemos la ultima lista activa
      setLastActiveIndex: function(index) {
        window.localStorage['lastlistaActiva'] = index;
      }
    }
  })

  //Controlador que maneja la lista de la compra.
  .controller('ListaCompraCtrl', function($scope, $timeout, $ionicModal, listas, $ionicSideMenuDelegate) {

     var lista_name;

    //Cargamos todas las listas
    $scope.listas = listas.all();
 
    //Almacenamos la ultima lista activa o la primera lista
    $scope.listaActiva = $scope.listas[listas.getLastActiveIndex()];

    $scope.sublistaActiva ="";

//////////////////////////////////////////////////////////////////////////////////////////////////

    // CREAR UNA LISTA (RECOGIDA DE DATOS DEL MODAL)
    $scope.createList = function(list) {
      //Recogemos el nombre de la lista
      var listaTitle = list.title;
      console.log(listaTitle);
      if(listaTitle) {
        //Creamos una lista a partir del titulo
        var nuevaLista = listas.nuevaLista(listaTitle);
        //Añadimos la nuevalista al array de listas
        $scope.listas.push(nuevaLista);
        //Almacenamos todas las listas en local storage
        listas.save($scope.listas);

        //Ocultamos el modal
        $scope.listModal.hide();

        //Establecemos la lista que acabamos de crear como la seleccionada
        $scope.seleccionarLista(nuevaLista, $scope.listas.length-1);
          list.title = "";
      }
    };


    //CREAR  UNA SUBLISTA
    $scope.createsubList = function(sublist) {
      //Añadimos la tarea a las tareas de la lista activa
      $scope.listaActiva.sublistas.push({
        title: sublist.title,
        backup_title: sublist.title,
        tasks: [],
        gasto: 0,
      });
      $scope.sublistModal.hide();
      //Almacena todas las listas tras añadir la ultima al array
      listas.save($scope.listas);

      //Vaciamos el campo del formulario de creacion de tareas
      sublist.title = "";
      console.log(JSON.stringify($scope.listaActiva));
    };
    

    //CREAR UNA TAREA
    //Creamos una nueva tarea
    $scope.createTask = function(task) {
      //Añadimos la tarea a las tareas de la lista activa
      $scope.listaActiva.tasks.push({
        title: task.title,
        checkbox: false,
        cantidad: task.cantidad
      });

      //Ocultamos el modal
      $scope.taskModal.hide();
      alert(parseFloat($scope.listaActiva.gasto));
      if(parseFloat($scope.listaActiva.gasto) > 0){
        disminuir_gasto_total($scope.listaActiva.gasto);
      }
      //Almacena todas las listas tras añadir la ultima al array
      listas.save($scope.listas);


      //Vaciamos el campo del formulario de creacion de tareas
      task.title = "";
      task.cantidad ="";
    };

    //CREAR UNA SUBTAREA
    //Creamos una nueva tarea
    $scope.createsubTask = function(subtask) {
      //Si no hay una lista seleccionada o un nombre de tarea, no  se crea
      //Añadimos la tarea a las tareas de la lista activa
      $scope.listaActiva.sublistas[$scope.sublistaActiva].tasks.push({
        title: subtask.title,
        checkbox: false,
        cantidad: subtask.cantidad
      });

      //Ocultamos el modal
      $scope.subtaskModal.hide();

      //Almacena todas las listas tras añadir la ultima al array
      listas.save($scope.listas);

      //Vaciamos el campo del formulario de creacion de tareas
      subtask.title = "";
      subtask
      console.log(JSON.stringify($scope.listaActiva));
    };

//////////////////////////////////////////////////////////////////////////////////////////////////

    // SELECCION DE LA LISTA PULSADA
    $scope.seleccionarLista = function(lista, index) {
      //Indicamos que la lista activa es la que hemos pulsado
      $scope.listaActiva = lista;
      console.log($scope.listaActiva.backup_title);

      //Almacenamos su nombre
      lista_name = $scope.listaActiva.title;

      //Almacenamos que esta lista es la ultima lista activa
      listas.setLastActiveIndex(index);

      //Cuando seleccionamos una lista, cerrarmos el menu lateral
      $ionicSideMenuDelegate.toggleLeft(false);
    };


    //FUNCIONALIDAD DEL ACORDEON 
    $scope.toggleSublista = function(sublista) {
      if ($scope.isSublistaShown(sublista)) {
        $scope.shownSublista= null;
      } else {
        $scope.shownSublista = sublista;
      }
    };
    $scope.isSublistaShown = function(sublista) {
      return $scope.shownSublista === sublista;
    };

//////////////////////////////////////////////////////////////////////////////////////////////////

    //CARGA DE MODALES

    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('new-subtask.html', function(modal) {
      $scope.subtaskModal = modal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('new-list.html', function(modal) {
      $scope.listModal = modal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('new-sublist.html', function(modal) {
      $scope.sublistModal = modal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('complete-task.html', function(modal) {
      $scope.completeTaskModal = modal;
    }, {
      scope: $scope
    });

    $ionicModal.fromTemplateUrl('complete-subtask.html', function(modal) {
      $scope.completesubTaskModal = modal;
    }, {
      scope: $scope
    });

    //Mostramos los modales cuando se pulsa el boton indicado

    $scope.newTask = function() {
      if(!$scope.listaActiva) {
        alert('Debe crear una lista');
        return;
      }
      else {
        $scope.taskModal.show();
      }
    };
    $scope.newList = function() {
      $scope.listModal.show();
    };

    $scope.newsubList = function() {
      if(!$scope.listaActiva) {
        alert('Debe crear una lista');
        return;
      }
      else {
              $scope.sublistModal.show();
      }
    };

    $scope.newsubTask = function(sublista) {
      console.log(JSON.stringify($scope.listaActiva.sublistas));
      var i =  $scope.listaActiva.sublistas.indexOf(sublista);
      if(i != -1) {
          $scope.sublistaActiva=i;
         $scope.sublistaActivaNombre=$scope.listaActiva.sublistas[i].backup_title;
      }
      console.log('SublistaActiva en posicion: '+$scope.sublistaActiva);
      $scope.subtaskModal.show();
    };

//////////////////////////////////////////////////////////////////////////////////////////////////

    //BOTON DE CIERRE DE LOS MODALES

    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    }

    $scope.closeNewsubTask = function() {
      $scope.subtaskModal.hide();
    }

    $scope.closeNewList = function() {
      $scope.listModal.hide();
    }

    $scope.closeNewsubList = function() {
      $scope.sublistModal.hide();
    }

    $scope.closeCompleteTask = function() {
      $scope.completeTaskModal.hide();
    }

    $scope.closeCompletesubTask = function() {
      $scope.completesubTaskModal.hide();
    }

//////////////////////////////////////////////////////////////////////////////////////////////////

    //Borra la tarea indicada
    $scope.deleteTask = function (task){
      //Localizamos la posicion de la tarea en el array de tareas
      var i =  $scope.listaActiva.tasks.indexOf(task);
      if(i != -1) {
          //Eliminamos la tarea del array
         $scope.listaActiva.tasks.splice(i, 1);
      }
      if ($scope.listaActiva.tasks.length == 0){
        if($scope.listaActiva.gasto){
          disminuir_gasto_total($scope.listaActiva.gasto);
        }
        $scope.listaActiva.gasto = "";

      }
      listas.save($scope.listas);
    };


    //Borra la tarea indicada
    $scope.deletesubTask = function (subtask, sublista){
      //Localizamos la posicion de la tarea en el array de tareas
      var sublistaindice = $scope.listaActiva.sublistas.indexOf(sublista);
      console.log(sublistaindice);
      var subtaskindice = $scope.listaActiva.sublistas[sublistaindice].tasks.indexOf(subtask);
      if(subtaskindice != -1) {
          //Eliminamos la tarea del array
         $scope.listaActiva.sublistas[sublistaindice].tasks.splice(subtaskindice, 1);
      }
    
      if($scope.listaActiva.sublistas[sublistaindice].tasks.length == 0){
        disminuir_gasto_total($scope.listaActiva.sublistas[sublistaindice].gasto);
        $scope.listaActiva.sublistas[sublistaindice].gasto = "";
        $scope.listaActiva.sublistas[sublistaindice].title = $scope.listaActiva.sublistas[sublistaindice].backup_title;
      }
      listas.save($scope.listas);
    };

    // BORRA LA LISTA INDICADA
    $scope.deleteList = function (lista){
      //Localizamos la posicion de la tarea en el array de tareas

      if(confirm('¿Quieres borrar esta lista?')){
        var i =  $scope.listas.indexOf(lista);
        if(i != -1) {
            //Eliminamos la tarea del array
           $scope.listas.splice(i, 1);
        }
        $scope.listaActiva = $scope.listas[listas.getLastActiveIndex()-1];

        listas.save($scope.listas);
      }
    };

        // BORRA LA LISTA INDICADA
    $scope.deletesubList = function (sublista){
      //Localizamos la posicion de la tarea en el array de tareas

      if(confirm('¿Quieres borrar esta sublista?')){
        var sublistaindice = $scope.listaActiva.sublistas.indexOf(sublista);
        console.log('3');
        disminuir_gasto_total($scope.listaActiva.sublistas[sublistaindice].gasto);
        if(sublistaindice != -1) {
            //Eliminamos la tarea del array
           $scope.listaActiva.sublistas.splice(sublistaindice, 1);
        }


        listas.save($scope.listas);
      }
    };

//

  $scope.completeTask = function(gasto){
    console.log(gasto);
    if (gasto > 0) {
      aumentar_gasto_total(gasto);
      listas.save($scope.listas);
    }
    $scope.completeTaskModal.hide();
  }

  $scope.completesubTask = function(gasto){
    if (gasto >0) {
      aumentar_gasto_total(gasto);
      $scope.sublistaActiva.title = $scope.sublistaActiva.backup_title + ' '+ $scope.sublistaActiva.gasto +'€'; 
      listas.save($scope.listas);
    }

    $scope.completesubTaskModal.hide();
  }


//////////////////////////////////////////////////////////////////////////////////////////////////

    //MOSTRAMOS LOS MENUS LATERALES

    //Cuando pulsamos el boton de mostrar la lista de menus
    $scope.mostrarMenuListas = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.mostrarMenusubListas = function() {
      $ionicSideMenuDelegate.toggleRight();
    };


//////////////////////////////////////////////////////////////////////////////////////////////////
    //VERIFICA QUE LA LISTA SE HA COMPLETADO

    //Verificamos que la lista este completa
    $scope.checkTask = function(task){

      if(task.checkbox === false){
        task.checkbox = true;
      }
      else {
        task.checkbox =false;
      }
      listas.save($scope.listas);
      var checked = 0;
      for(i=0; i< $scope.listaActiva.tasks.length ; i++){
        
        if($scope.listaActiva.tasks[i].checkbox == true) {
          checked ++;
        }
      }
      if(checked === $scope.listaActiva.tasks.length){
        $scope.completeTaskModal.show();
      }

      if(checked === ($scope.listaActiva.tasks.length - 1) || checked === 0){
        if($scope.listaActiva.gasto >0){
          disminuir_gasto_total($scope.listaActiva.gasto);
          $scope.listaActiva.gasto = "";
        }

      }

    }


    //Verificamos que la sublista este completa
    $scope.checksubTask = function(subtask, sublista){

      if(subtask.checkbox === false){
        subtask.checkbox = true;
      }
      else {
        subtask.checkbox =false;
      }
      listas.save($scope.listas);

      var sublistaindice = $scope.listaActiva.sublistas.indexOf(sublista);
      $scope.sublistaActiva = $scope.listaActiva.sublistas[sublistaindice];

      var checked = 0;
      for(i=0; i< $scope.listaActiva.sublistas[sublistaindice].tasks.length ; i++){      
        if($scope.listaActiva.sublistas[sublistaindice].tasks[i].checkbox == true) {
          checked ++;
        }
        else {
          $scope.listaActiva.sublistas[sublistaindice].title = $scope.listaActiva.sublistas[sublistaindice].backup_title;
        }
      }
      if(checked === $scope.listaActiva.sublistas[sublistaindice].tasks.length){
        $scope.completesubTaskModal.show();
      }
      if(checked === ($scope.listaActiva.sublistas[sublistaindice].tasks.length - 1)){
        if($scope.listaActiva.sublistas[sublistaindice].gasto){
          disminuir_gasto_total($scope.listaActiva.sublistas[sublistaindice].gasto);
          $scope.listaActiva.sublistas[sublistaindice].gasto = "";
        }

      }

    }


    function aumentar_gasto_total(cantidad){

      cantidad = parseFloat(cantidad);
      gasto_total_actual =  parseFloat($scope.listaActiva.gasto_total);
      total = gasto_total_actual + cantidad;
      $scope.listaActiva.gasto_total = total;

      listas.save($scope.listas);
    }

    function disminuir_gasto_total(cantidad){
      console.log('disminuir: '+cantidad);
      cantidad =  parseFloat(cantidad);
      gasto_total_actual =  parseFloat($scope.listaActiva.gasto_total);
      total = gasto_total_actual - cantidad;
      $scope.listaActiva.gasto_total = total;
      listas.save($scope.listas);
    }


});
