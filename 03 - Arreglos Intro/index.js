var alumnos = [
    {nombre: "Carlos", apellido: "Manuel", edad: 19, matricula: 2043723},
    {nombre: "Cesar", apellido: "Oziel", edad: 20, matricula: 2043653},
    {nombre: "Regina", apellido: "Sosa", edad: 21, matricula: 2032723},
    {nombre: "Diego Leonardo", apellido: "Angus", edad: 20, matricula: 2047253},
    {nombre: "Diego Armando", apellido: "Maradona", edad: 21, matricula: 2873723},
    {nombre: "Andrea Carolina", apellido: "Alfaro", edad:21, matricula: 2043703},
    {nombre: "Diego Alonso", apellido: "Villanueva", edad:20, matricula: 2054599},
    {nombre: "Regina", apellido: "Dariela", edad:22, matricula: 2044325},
    {nombre: "Axel Gabriel", apellido: "Gutierrez", edad: 21, matricula: 2075636},
    {nombre: "Erick Leonardo", apellido: "Sanchez", edad: 20, matricula: 2094893},
];

// Normaliza los apellidos: intenta separar paterno y materno a partir del campo 'apellido'
function normalizarApellidos(arr) {
    arr.forEach(a => {
        var ap = (a.apellido || "").trim();
        var partes = ap.split(/\s+/).filter(Boolean);
        if (partes.length === 0) {
            a.apellidoPaterno = "";
            a.apellidoMaterno = "";
        } else if (partes.length === 1) {
            // Si sólo hay uno, lo tomamos como paterno y materno vacío
            a.apellidoPaterno = partes[0];
            a.apellidoMaterno = "";
        } else {
            // Primer token = paterno, último token = materno (heurística simple)
            a.apellidoPaterno = partes[0];
            a.apellidoMaterno = partes[partes.length - 1];
        }
        // campo con apellidos completos para mostrar
        a.apellidos = [a.apellidoPaterno, a.apellidoMaterno].filter(Boolean).join(" ");
    });
}

normalizarApellidos(alumnos);

var input = document.getElementById("filtrAlumno");
var boton = document.getElementById("btnBuscar");
var lista = document.getElementById("listaAlumnos");
var mensaje = document.getElementById("mensaje");
var btnOrdenar = document.getElementById("btnOrdenar");
var btnLimpiar = document.getElementById("btnLimpiar");

function mostrarMensaje(text) {
    mensaje.style.display = "block";
    mensaje.textContent = text;
}

function renderLista(arr) {
    lista.innerHTML = "";
    arr.forEach(a => {
        var li = document.createElement("li");
        li.innerHTML = `<strong>${a.nombre}</strong> ${a.apellidos ? (' - ' + a.apellidos) : ''} <span class="meta">(Edad: ${a.edad}) (Matrícula: ${a.matricula})</span>`;
        lista.appendChild(li);
    });
}

function obtenerTipoApellido() {
    var sel = document.querySelector('input[name="tipoApellido"]:checked');
    return sel ? sel.value : "paterno";
}

function buscar() {
    var texto = input.value.trim().toLowerCase();
    var tipo = obtenerTipoApellido();

    if (texto === "") {
        mostrarMensaje("Alumnos disponibles:");
        renderLista(alumnos);
        return;
    }

    var encontrados = alumnos.filter(a => {
        // Busca en nombre completo
        if (a.nombre.toLowerCase().includes(texto)) return true;

        // Busca según tipo de apellido seleccionado
        var campoApellido = tipo === "materno" ? (a.apellidoMaterno || "") : (a.apellidoPaterno || "");
        if (campoApellido.toLowerCase().includes(texto)) return true;

        // También permitir buscar dentro del campo completo de apellidos
        if ((a.apellidos || "").toLowerCase().includes(texto)) return true;

        // edad y matrícula
        if (a.edad.toString().includes(texto)) return true;
        if (a.matricula.toString().includes(texto)) return true;

        return false;
    });

    if (encontrados.length > 0) {
        mostrarMensaje("Coincidencias encontradas:");
        renderLista(encontrados);
    } else {
        mostrarMensaje("No se encontraron coincidencias. Mostrando lista completa:");
        renderLista(alumnos);
    }
}

boton.onclick = buscar;
input.addEventListener("keydown", function(e){ if (e.key === "Enter") buscar(); });

btnOrdenar.onclick = function() {
    var tipo = obtenerTipoApellido();
    alumnos.sort(function(a,b){
        var aa = (tipo === "materno" ? a.apellidoMaterno : a.apellidoPaterno) || "";
        var bb = (tipo === "materno" ? b.apellidoMaterno : b.apellidoPaterno) || "";
        return aa.localeCompare(bb, 'es', {sensitivity: 'base'});
    });
    mostrarMensaje("Lista ordenada por apellido " + (tipo === "materno" ? "materno" : "paterno") + ":");
    renderLista(alumnos);
};

btnLimpiar.onclick = function() {
    input.value = "";
    document.querySelector('input[name="tipoApellido"][value="paterno"]').checked = true;
    mostrarMensaje("Alumnos disponibles:");
    renderLista(alumnos);
};

// Mostrar lista inicial
mostrarMensaje("Alumnos disponibles:");
renderLista(alumnos);
// ...existing code...