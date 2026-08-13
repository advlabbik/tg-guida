window.ICONS = {
  certificato:'stethoscope', gpsguide:'satellite', pacco:'backpack', delega:'handshake', cambio:'repeat',
  luogo:'map-pin', treno:'train-front', auto:'car', taxi:'car-taxi-front',
  sicurezza:'shield', materiale:'hard-hat', colmargherita:'mountain', acqua:'droplets', meteo:'cloud-sun-rain',
  animali:'paw-print', criticita:'triangle-alert',
  whip:'key-round', emergenze:'siren', arrivo:'flag', social:'megaphone',
  bivacco:'tent', ebike:'battery-charging', sconti:'tag', rovereto:'landmark'
};
function icon(name, size){
  size = size || 18;
  return `<svg width="${size}" height="${size}"><use href="icons/sprite.svg#i-${name}"/></svg>`;
}
