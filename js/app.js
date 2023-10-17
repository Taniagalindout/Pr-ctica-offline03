console.log("App.js");
if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js')
}
const app = fetch('app', {})