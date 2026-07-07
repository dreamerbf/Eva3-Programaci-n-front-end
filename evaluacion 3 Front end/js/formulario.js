$(document).ready(function () {

  var $form = $("#formUsuario");

  if (window.location.protocol === "file:") {
    $form.before(
      '<div class="alert alert-danger">' +
        '<strong>Estás abriendo este archivo con doble clic (file://).</strong> ' +
        "Los datos que guardes aquí NO se verán en index.html mientras no uses un servidor local " +
        "(ej. extensión &quot;Live Server&quot; de VS Code, o <code>python -m http.server</code>) " +
        "accediendo vía <code>http://localhost:...</code>." +
        "</div>"
    );
  }


  function validarNombre() {
    var valor = $("#nombre").val().trim();
    var valido = valor.length >= 3 && /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor);
    $("#nombre").toggleClass("is-invalid", !valido);
    return valido;
  }

  function validarUsuario() {
    var valor = $("#usuario").val().trim();
    var valido = valor.length >= 3 && /^\S+$/.test(valor);
    $("#usuario").toggleClass("is-invalid", !valido);
    return valido;
  }

  function validarFecha() {
    var valor = $("#fechaIngreso").val(); 
    var valido = false;
    if (valor) {
      var regex = /^\d{4}-\d{2}-\d{2}$/;
      if (regex.test(valor)) {
        var fecha = new Date(valor);
        valido = !isNaN(fecha.getTime());
      }
    }
    $("#fechaIngreso").toggleClass("is-invalid", !valido);
    return valido;
  }

  function validarEmail() {
    var valor = $("#email").val().trim();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var valido = regex.test(valor);
    $("#email").toggleClass("is-invalid", !valido);
    return valido;
  }

  function validarSitioWeb() {
    var valor = $("#sitioWeb").val().trim();
    if (valor === "") {
      $("#sitioWeb").removeClass("is-invalid");
      return true;
    }
    var regex = /^https?:\/\/[^\s]+\.[^\s]+$/;
    var valido = regex.test(valor);
    $("#sitioWeb").toggleClass("is-invalid", !valido);
    return valido;
  }

  $("#nombre").on("input", validarNombre);
  $("#usuario").on("input", validarUsuario);
  $("#fechaIngreso").on("input change", validarFecha);
  $("#email").on("input", validarEmail);
  $("#sitioWeb").on("input", validarSitioWeb);

  function formatearFechaVisual(fechaISO) {
    var partes = fechaISO.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  function limpiarFormulario() {
    $form[0].reset();
    $form.find(".form-control").removeClass("is-invalid");
  }

  $("#btnCancelar").on("click", function () {
    limpiarFormulario();
  });

  $form.on("submit", function (e) {
    e.preventDefault();

    var nombreOk = validarNombre();
    var usuarioOk = validarUsuario();
    var fechaOk = validarFecha();
    var emailOk = validarEmail();
    var sitioOk = validarSitioWeb();

    var formularioValido = nombreOk && usuarioOk && fechaOk && emailOk && sitioOk;

    if (!formularioValido) {
      return;
    }

    var nuevoUsuario = {
      nombre: $("#nombre").val().trim(),
      usuario: $("#usuario").val().trim(),
      fechaIngreso: $("#fechaIngreso").val(),
      email: $("#email").val().trim(),
      sitioWeb: $("#sitioWeb").val().trim()
    };

    var usuariosGuardados = JSON.parse(localStorage.getItem("usuariosNuevos") || "[]");
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuariosNuevos", JSON.stringify(usuariosGuardados));

    var modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
    modal.show();

    $("#btnModalOk").off("click").on("click", function () {
      limpiarFormulario();
      modal.hide();
      window.location.href = "index.html";
    });
  });

});
