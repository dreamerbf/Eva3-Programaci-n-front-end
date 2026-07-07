$(document).ready(function () {

  var API_URL = "https://jsonplaceholder.typicode.com/users";

 
  if (window.location.protocol === "file:") {
    $("#alertContainer").append(
      '<div class="alert alert-danger">' +
        '<strong>Estás abriendo este archivo con doble clic (file://).</strong> ' +
        "En este modo, el navegador no comparte los datos guardados entre index.html y formulario.html, " +
        "por lo que los usuarios que crees en el formulario NO aparecerán aquí. " +
        "Ejecuta la webapp con un servidor local (por ejemplo la extensión &quot;Live Server&quot; de VS Code, " +
        "o el comando <code>python -m http.server</code> dentro de la carpeta) y accede vía " +
        "<code>http://localhost:...</code>." +
        "</div>"
    );
  }

  function obtenerUsuariosLocales() {
    try {
      var data = localStorage.getItem("usuariosNuevos");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("No se pudo leer localStorage:", e);
      return [];
    }
  }

  function formatearFechaVisual(fechaISO) {
    if (!fechaISO) return "-";
    var partes = fechaISO.split("-"); 
    if (partes.length !== 3) return fechaISO;
    return partes[2] + "/" + partes[1] + "/" + partes[0]; 
  }

  var columnasTabla = [
    { data: "nombre" },
    { data: "usuario" },
    { data: "fechaIngreso" },
    { data: "email" },
    {
      data: "sitioWeb",
      render: function (data) {
        if (!data || data === "-") return "-";
        return '<a href="' + data + '" target="_blank" rel="noopener">' + data + "</a>";
      }
    }
  ];

  
  var locales = obtenerUsuariosLocales().map(function (u) {
    return {
      nombre: u.nombre,
      usuario: u.usuario,
      fechaIngreso: formatearFechaVisual(u.fechaIngreso),
      email: u.email,
      sitioWeb: u.sitioWeb || "-"
    };
  });

  console.log("Usuarios locales encontrados:", locales.length, locales);

  var tabla = $("#tablaUsuarios").DataTable({
    data: locales,
    columns: columnasTabla,
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ registros",
      info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
      infoEmpty: "Mostrando 0 a 0 de 0 registros",
      infoFiltered: "(filtrado de _MAX_ registros totales)",
      zeroRecords: "No se encontraron registros coincidentes",
      emptyTable: "No hay datos disponibles en la tabla",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior"
      }
    },
    order: [[0, "asc"]]
  });

  
  $.getJSON(API_URL)
    .done(function (usuariosApi) {
      var filasApi = usuariosApi.map(function (u) {
        return {
          nombre: u.name,
          usuario: u.username,
          fechaIngreso: "-", 
          email: u.email,
          sitioWeb: u.website ? ("http://" + u.website) : "-"
        };
      });

      tabla.rows.add(filasApi).draw();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error al consultar la API:", textStatus, errorThrown);
      $("#alertContainer").html(
        '<div class="alert alert-warning">No se pudo obtener la información de usuarios desde la API (' +
          textStatus +
          '). Se muestran solo los registros creados localmente. Si abriste el archivo con doble clic, usa un servidor local (ej. Live Server) en vez de file://.</div>'
      );
    });

});
