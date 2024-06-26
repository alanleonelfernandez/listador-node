require('colors');
const { guardarDB, leerDB } = require('./db/guardarArchivo');
const { 
    inquirerMenu, 
    pausa, 
    leerInput, 
    listadoTareasBorrar, 
    confirmar, 
    mostrarListadoChecklist
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

console.clear();

const main = async() => {

    let opt = ''
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){
        tareas.cargarTareasFromArray(tareasDB);
    }

    do{
        //se imprime el menu
        opt = await inquirerMenu();

        switch(opt){
            case '1': //crear
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
            break;

            case '2': //listar
                tareas.listadoCompleto();
            break;

            case '3': //completadas
                tareas.listarPendientesCompletadas(true);
            break;

            case '4': //pendientes
                tareas.listarPendientesCompletadas(false);
            break;

            case '5': //completadas|pendientes
                const ids = await mostrarListadoChecklist(tareas.listadoArr)
                tareas.toggleCompletadas(ids);
            break;

            case '6': //borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id !== '0'){
                    const ok = await confirmar('¿Estas seguro?')
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada con exito');
                    }
                }
            break;
        }

        guardarDB(tareas.listadoArr);
        
        await pausa();

    }while( opt !== '0');


}

main();