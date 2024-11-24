const boton = document.querySelector("#boton");
const inputValor = document.querySelector("input");
const selectMoneda = document.querySelector("select");
const resultado = document.querySelector(".resultado-conversor");
const canvasGrafico = document.getElementById("grafico");

async function getInfo(moneda) {
  try {
    const apiUrl = `https://mindicador.cl/api/${moneda}`;
    const res = await fetch(apiUrl);
    const datos = await res.json();
    return datos;
  } catch (error) {
    resultado.innerHTML = `Error al obtener datos: ${error.message}`;
  }
}
async function convertirMoneda() {
  try {
    const valorIngresado = Number(inputValor.value);
    const moneda = selectMoneda.value;
    if (valorIngresado <= 0) {
      resultado.innerHTML = "Ingrese un monto válido.";
      return;
    }
    const datos = await getInfo(moneda);
    const valorActual = datos.serie[0].valor;
    const valorConvertido = valorIngresado / valorActual;
    resultado.innerHTML = `Resultado: ${valorConvertido} ${moneda}.`;
    crearGrafico(datos.serie.slice(0, 10), moneda);
  } catch (error) {
    resultado.innerHTML = `Algo salió mal: ${error.message}`;
  }
}
function crearGrafico(serie, moneda) {
  const labels = serie.map((item) => item.fecha.split("T")[0]);
  const data = serie.map((item) => item.valor);
  const config = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Valor ${moneda} últimos 10 días`,
          borderColor: "red",
          data,
        },
      ],
    },
  };
  if (window.miGrafico) {
    window.miGrafico.destroy();
  }
  window.miGrafico = new Chart(canvasGrafico, config);
}
boton.addEventListener("click", convertirMoneda);
