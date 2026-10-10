import './style.css'
import { createClient } from '@supabase/supabase-js'

// Inicializar Supabase
const supabaseUrl = 'https://chaxssedewictbazgtue.supabase.co';
const supabaseKey = 'sb_publishable_B_qtMijSvDUE2ZnZDj_Ksw_ubDor8H2';
let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch(e) {
  console.error("Error al inicializar Supabase", e);
}

document.addEventListener('DOMContentLoaded', () => {
  // Disparar confeti al entrar a la aplicación
  setTimeout(() => {
    createConfetti();
  }, 500);

  const btn = document.getElementById('rsvp-btn');
  const modal = document.getElementById('rsvp-modal');
  const closeBtn = document.getElementById('close-modal');
  const rsvpForm = document.getElementById('rsvp-form');
  const submitBtn = document.getElementById('submit-rsvp');
  const rsvpVideo = document.getElementById('rsvp-video');
  const modalIntro = document.getElementById('modal-intro');
  const modalForm = document.getElementById('modal-form-content');
  
  if (btn && modal) {
    btn.addEventListener('click', () => {
      const walkingSnoopy = document.querySelector('.snoopy-video');
      
      // Configurar el modal en estado inicial
      modalIntro.style.display = 'flex';
      modalForm.style.display = 'none';
      modalForm.style.opacity = '0';
      modal.classList.add('active');
      
      // Detener otras animaciones
      if (walkingSnoopy) {
        walkingSnoopy.pause();
        walkingSnoopy.style.animationPlayState = 'paused';
      }

      // Reproducir el video
      if (rsvpVideo) {
        rsvpVideo.currentTime = 0;
        
        let formShown = false;
        const ensureForm = () => {
          if (!formShown) {
            formShown = true;
            showForm();
          }
        };

        rsvpVideo.play().catch(e => {
          // Si el navegador bloquea el autoplay por alguna razon, saltar al formulario directo
          console.warn('Auto-play prevent', e);
          ensureForm();
        });

        // Cuando el video termina, mostrar formulario
        rsvpVideo.onended = ensureForm;
        
        // Failsafe: En dispositivos lentos si el video se traba, mostrar el formulario después de 4 segundos
        setTimeout(ensureForm, 4000);

      } else {
        showForm();
      }
    });
  }

  function showForm() {
    modalIntro.style.display = 'none';
    modalForm.style.display = 'block';
    // Pequeño timeout para que la transicion de opacidad funcione al cambiar el display
    setTimeout(() => {
      modalForm.style.opacity = '1';
    }, 50);
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (rsvpVideo) rsvpVideo.pause();
      
      const walkingSnoopy = document.querySelector('.snoopy-video');
      if (walkingSnoopy) {
        walkingSnoopy.play().catch(e => console.warn(e));
        walkingSnoopy.style.animationPlayState = 'running';
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('rsvp-name').value;
      const guests = document.getElementById('rsvp-guests').value;

      submitBtn.innerHTML = 'Enviando...';
      submitBtn.style.pointerEvents = 'none';

      if (supabase) {
        const { error } = await supabase
          .from('rsvps')
          .insert([{ name, guests: parseInt(guests), status: 'confirmed', created_at: new Date() }]);
          
        if (error) {
          console.error('Error guardando RSVP en Supabase:', error);
          alert('Hubo un error al confirmar. Por favor intenta de nuevo.');
          submitBtn.innerHTML = 'Confirmar Asistencia';
          submitBtn.style.pointerEvents = 'auto';
        } else {
          submitBtn.innerHTML = '¡Nos vemos pronto! 🎉';
          submitBtn.style.background = 'var(--blanco-puro)';
          submitBtn.style.color = 'var(--negro-ebano)';
          createConfetti();
          setTimeout(() => {
            modal.classList.remove('active');
          }, 2500);
        }
      } else {
        alert('Modo local: RSVP enviado. (Supabase no configurado)');
        modal.classList.remove('active');
      }
    });
  }
});

function createConfetti() {
  const colors = ['#FFFFFF', '#A4D3F2', '#8B1E24', '#1A1A1A']; // Snoopy palette
  
  for (let i = 0; i < 70; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Randomize color, position, and animation timing
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    
    // Vary size for depth
    const size = Math.random() * 8 + 4; // 4px to 12px
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    
    // Randomize animation
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    
    document.body.appendChild(confetti);
    
    // Cleanup after animation ends
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}
