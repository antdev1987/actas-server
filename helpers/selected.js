  /* 
    codigo de abajo es para determinar el tipo de folder, ya sea entrega o devolucion 
    asi se podra guardar en la base de datos adecuada
  */

    import Entrega from "../models/Entrega.js";
    import Devolucion from "../models/Devolucion.js";
    import PlanMantenimiento from "../models/PlanMantenimiento.js";


    const selected = (selector)=>{
        let pickSelector;
        if (selector === "Entrega") {
          pickSelector = Entrega;
        } else if (selector === "Devolucion") {
          pickSelector = Devolucion;
        }else if(selector === 'PlanMantenimiento'){
          pickSelector = PlanMantenimiento
        }
        return pickSelector
    }

    export default selected