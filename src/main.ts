import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { filterWeekdays } from './services/utils.ts'
import { Day } from './services/types.ts'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, DialogService } from 'primevue'
import 'primeicons/primeicons.css'

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false 
    }
  }
});
app.use(DialogService);
app.use(ConfirmationService);
app.mount('#app');

window["filterWeekdays"] = filterWeekdays;
window["Day"] = Day;