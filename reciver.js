const socket = io();

let solaredgePotenzaTotaleDc;
let prismSensoreRete;
let consumoCasa;
let lgCaricaScaricaIstantaneaKw;
let lgPercentualeDiCarica;
let boilerPower;
// car
let opelPercentge;
let prismStato;
let prismPotenzaDiCarica;

let energiaFv; 
let energiaRete;
let consumoHome;
let caricaLG;
let percenutualeLG;
// GET HTML DIV //
const carValuePercentageDiv = document.getElementById("unit-car-percentage");
const carValuePowerDiv = document.getElementById("unit-car-power");

// // Gestione dell'evento di errore in caso nodejs sia offline
// socket.on('error', (error) => {
//   console.error('Si è verificato un errore di connessione con nodejs:', error);

// });
// socket.on riceve i dati aggiornati secondo le regole del server (ogni 2 secondi) 
socket.on('dati', (data) => {
                    //console.log(data);

                    if(hasError(data))
                    {
                      solaredgePotenzaTotaleDc = "..."; //getValueById(data, "sensor.solaredge_potenza_totale_dc"); console.log("solaredgePotenzaTotaleDc: " + solaredgePotenzaTotaleDc);
                      prismSensoreRete = "...";
                      consumoCasa = "...";
                      lgCaricaScaricaIstantaneaKw = "...";
                      lgPercentualeDiCarica = "...";
                      boilerPower = "...";
                      // car
                      opelPercentge = "...";
                      prismStato = "...";
                      prismPotenzaDiCarica = "...";

                      // APPARE ALERT CON SCRITTO "IMMPOSSIBILE COMUNICARE CON IL SERVER"
                      showConnectionAPIAlert();
                    
                    }
                    else
                    {
                      hideConnectionAPIAlert(); 
                      // GET VALUE FROM DATA RESPONSE //
                      solaredgePotenzaTotaleDc = data['solaredge_potenza_totale_dc']; //getValueById(data, "sensor.solaredge_potenza_totale_dc"); console.log("solaredgePotenzaTotaleDc: " + solaredgePotenzaTotaleDc);
                      prismSensoreRete = data['prism_sensore_rete'];
                      consumoCasa = data['consumo_casa'];
                      lgCaricaScaricaIstantaneaKw = data['lg_carica_scarica_istantanea_kw'];
                      lgPercentualeDiCarica = data['lg_percentuale_di_carica'];
                      boilerPower = data['shelly_consumo_boiler'];
                      // car
                      opelPercentge = data['car_corsa_energy_level'];
                      prismStato = data['prism_stato'];
                      prismPotenzaDiCarica = data['prism_potenza_di_carica'];
                      //console.log("prismStato: " + prismStato);
                      //console.log("prismPotenzaDiCarica: " + prismPotenzaDiCarica);


                     energiaFv = roundValue(solaredgePotenzaTotaleDc); //console.log("energiaFV: " + energiaFv);
                     energiaRete = roundValue(prismSensoreRete); //console.log("energiaRete: " + energiaRete);
                     consumoHome = roundValue(consumoCasa); //console.log("consumoHome: " + consumoHome);
                     caricaLG = roundValue(lgCaricaScaricaIstantaneaKw); //console.log("caricaLG: " + caricaLG);
                     percenutualeLG = lgPercentualeDiCarica; //console.log("percenutualeLG: " + percenutualeLG);

                    // SET VALUE IN HTML //
                    // fvValueDiv.textContent = solaredgePotenzaTotaleDc.value + " kw";
                    setRoundValue("fv-value", energiaFv);
                    setRoundValue("grid-value", energiaRete);
                    setRoundValue("grid-value-alert", energiaRete);
                    setRoundValue("house-value", consumoHome);
                    setRoundValue("battery-power-value", caricaLG);
                    setBatteryValueSize("battery-percentage-value", percenutualeLG);
                    //car
                    carValuePercentageDiv.textContent = opelPercentge + "%";
                    carValuePowerDiv.textContent = prismPotenzaDiCarica + " kw";


                      updateEnergyBar(energiaFv);
                      ChangeCarIcon(prismStato, prismPotenzaDiCarica);
                      boilerIcon(boilerPower);
                      updateArrowVisibility(energiaFv, energiaRete, consumoHome, caricaLG);
                      updateBatteryLevel(percenutualeLG);
                      updateWeatherImage(energiaFv);
                      checkForEnergyAlert(energiaRete, prismPotenzaDiCarica.value);

                  }

});
      function ChangeCarIcon(prismState, prismPower) {
        // console.log("prismState: " + prismState);
        // console.log("prismPower: " + prismPower);
        const carImage = document.getElementById('eletric-car-img');   
        const carValuePowerDiv = document.getElementById("unit-car-power");
     
        const carBlock = document.getElementById('car-div');
        if (prismPower > 0.2) {
          carBlock.style.visibility = 'visible';
        }
        else {
          carBlock.style.visibility = 'hidden';
        }
      }
  
      function boilerIcon(boilerPower) {
        const boilerImage = document.getElementById('boiler-img');   
        if (boilerPower > 0.2) {
          boilerImage.style.visibility = 'visible';
        }
        else {
          boilerImage.style.visibility = 'hidden';
        }
      }
  
      function setRoundValue(idHtml, value) {
        const element = document.getElementById(idHtml);
        if (value == "NaN" || value == "Undefined" || value == "undefined" || value == "Unavailable" || value == "unavailable" || value == 999) 
        {
          element.textContent = "...";
          console.log("elemento destinato a " + idHtml + " non trovato");
          return;
        }
        else if (value == "...") 
        {
          element.textContent = "...";
          return;
        }
        else {
          let numericValue;
          try {
            numericValue = parseFloat(value);
          } catch (e) {
            console.log("errore nel parsefloat: " + value);
            return;
          }
          const roundedValue = Math.round(numericValue * 10) / 10;
          element.textContent = roundedValue;
        }
      }
  
      function roundValue(value) {
        //console.log("value dentro roundValue: " + value);
        if (value == "..." || value == "NaN" || value == "Undefined" || value == "undefined" || value == "Unavailable" || value == "unavailable" || isNaN(value)) 
        {
          //console.log("errore letura valore durante il roundValue(): " + value);
          //console.log("OFFLINE");
          return "...";
        }
        let numericValue;
        try {
          numericValue = parseFloat(value);
        } catch (e) {
          console.log("errore nel parsefloat: " + value);
          return;
        }
        return Math.round(numericValue * 10) / 10;
      }
  
      function setBatteryValueSize(idHtml, value) {
        const element = document.getElementById(idHtml);
        const block = document.getElementById('battery-level-percentage-value');
        if (block == 100) {
          block.style.display = 'none';
        }
        else {
          block.style.display = 'block';
        }
        element.textContent = value;
      }

      function hasError(json) {
        // Verifica se l'oggetto JSON contiene la chiave "error" e se il suo valore non è vuoto
        if (json.hasOwnProperty('error') && json.error !== null && json.error !== undefined && json.error !== '') {
            return true; // Restituisce true se la chiave "error" non è vuota
        } else {
            return false; // Restituisce false altrimenti
        }
    }


    function showConnectionAPIAlert() {
      var bodyPage = document.getElementById("bodyPageWithoutAlert");
      if (bodyPage.style.filter !== 'blur(25px)') {
        bodyPage.style.filter = 'blur(25px)';
      }
      //else {console.log("effetto sfocato già impostato");}

      var alert = document.getElementById("internetConnectionAlert");
      alert.style.display = "block";
      if (alert.style.display !== 'block') {
        alert.style.display = 'block';
      }
      //else {console.log("alert visibile già impostato");}

    }

    // Funzione per ripristinare la pagina web e nascondere l'alert
    function hideConnectionAPIAlert() {
      var avviso = document.getElementById("internetConnectionAlert");
      avviso.style.display = "none";

      var avviso = document.getElementById("bodyPageWithoutAlert");
      avviso.style.filter = 'none';
    }
