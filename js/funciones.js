window.addEventListener("load",GetLista);

var evento;//para guardar la referencia del evento dobleClick


function $(value) {
    return document.getElementById(value);
}

function $_tr() {
    return document.createElement("tr");
}
function $_td() {
    return document.createElement("td");
}
    function GetLista() {

        var table = $("tbody");
        var peticionHttp = new XMLHttpRequest();
        peticionHttp.open("GET", "http://localhost:3000/materias", true);
        peticionHttp.send();

        peticionHttp.onreadystatechange = function () {
            if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
                var listaMaterias = JSON.parse(peticionHttp.responseText);
                for (var i = 0; i < listaMaterias.length; i++) {
                    var tr = $_tr();
                    table.appendChild(tr);
                    var id = document.createTextNode(listaMaterias[i].id);
                    var nombre = document.createTextNode(listaMaterias[i].nombre);
                    var cuatrimestre = document.createTextNode(listaMaterias[i].cuatrimestre);
                    var fechaFinal = document.createTextNode(listaMaterias[i].fechaFinal);
                    var turno = document.createTextNode(listaMaterias[i].turno);
                
                    var tdId = $_td();
                    var tdNombre = $_td();
                    var tdCuatrimestre = $_td();
                    var tdFechaFinal = $_td();
                    var tdTurno = $_td();

                    tdId.appendChild(id);
                    tdNombre.appendChild(nombre);
                    tdCuatrimestre.appendChild(cuatrimestre);
                    tdFechaFinal.appendChild(fechaFinal);
                    tdTurno.appendChild(turno);
                    // tdId.style.setProperty("visibility", "hidden");

                    tr.appendChild(tdId);
                    tr.appendChild(tdNombre);
                    tr.appendChild(tdCuatrimestre);
                    tr.appendChild(tdFechaFinal);
                    tr.appendChild(tdTurno);
                    tr.addEventListener("dblclick",MostrarTabla);
                }

            }

        }

    }

    function MostrarTabla(event) {

        evento = event.target;
        var form = $("formulario");
        form.style.setProperty("visibility", "unset");
        var tr = evento.parentNode;
        $("txtMateria").value = tr.childNodes[1].innerHTML;
        $("selectMateria").value = tr.childNodes[2].innerHTML;
        var fechaFinal = tr.childNodes[3].innerHTML;
        var array = fechaFinal.split("/");
        $("txtFecha").value = array[2] + "-" + array[1] + "-" + array[0];
        var btnMañana = $("btnMañana");
        var btnNoche = $("btnNoche");

        if (tr.childNodes[4].innerHTML === "Mañana") {
            btnMañana.checked = true;
        }
        else {
            btnNoche.checked = true;
        }
        var select = $("selectMateria");
        for(var i=0; i<select.length;i++){
            select.options[i].disabled = true;
        }
        
        var btnModificar = $("btnModificar");
        btnModificar.addEventListener("click", Modificar);
        var btnEliminar = $("btnEliminar");
        btnEliminar.addEventListener("click", Eliminar);
        var btnCerrar = $("btnCerrar");
        btnCerrar.addEventListener("click",function(){
            form.style.setProperty("visibility","hidden");
            $("txtMateria").style.setProperty("border-color","unset");
        });
    }

    function Modificar() {
        var tr = evento.parentNode;
        var id = tr.childNodes[0].childNodes[0].nodeValue;
        var cuatrimestre = $("selectMateria").value;

        var materiaValida = true;
        var fechaValida = true;

        var spinner = $("Spinner");
        var nombreMateria = $("txtMateria");
        
        var turno;
        if ($("btnMañana").checked) {
            turno = "Mañana";
        }
        else {
            turno = "Noche";
        }
        
        if (nombreMateria.value.length<=6)
        {
            materiaValida = false;
            nombreMateria.style.setProperty("border-color","red");
        }

        var fecha = $("txtFecha");
        var array = fecha.value.split("-");
        var fechaFinal = array[2] + "/" + array[1] + "/" + array[0];//la que paso al json

        var fechaHoy = new Date();
        console.log(fechaHoy);
        if(fechaHoy > fecha.value)
        {
            fechaValida = false;
            fecha.style.setProperty("border-color","red");
        }
        
        if (materiaValida && fechaValida) {
            spinner.style.setProperty("visibility","unset");
            var peticionHttp = new XMLHttpRequest();
            peticionHttp.open("POST", "http://localhost:3000/editar");
            peticionHttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            var materiaJson = ({ id:id, nombre:nombreMateria.value, cuatrimestre:cuatrimestre, fechaFinal:fechaFinal, turno:turno });
            var materiaJson = JSON.stringify(materiaJson);
            peticionHttp.send(materiaJson);
    
            peticionHttp.onreadystatechange = function () {
                if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
                    spinner.style.setProperty("visibility","hidden");
                    var tr = evento.parentNode;
                    tr.childNodes[1].innerHTML = nombreMateria.value;
                    tr.childNodes[2].innerHTML = cuatrimestre;
                    tr.childNodes[3].innerHTML = fechaFinal;
                    tr.childNodes[4].innerHTML = turno;
                }
            }
            var form = $("formulario");
            form.style.setProperty("visibility", "hidden");

    }
}

function Eliminar() {
    var tr = evento.parentNode;
    var spinner = $("Spinner");

    var id = tr.childNodes[0].childNodes[0].nodeValue;
 
    var peticionHttp=new XMLHttpRequest();
    peticionHttp.open("POST","http://localhost:3000/eliminar");
    peticionHttp.setRequestHeader("Content-type","application/json");
    var materiaJson = {"id": id };
    peticionHttp.send(JSON.stringify(materiaJson));
    spinner.style.setProperty("visibility","unset");

    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
            spinner.style.setProperty("visibility","hidden");
            $("tbody").removeChild(evento.parentNode);
    }
}
    var form = $("formulario");
    form.style.setProperty("visibility", "hidden");
}

