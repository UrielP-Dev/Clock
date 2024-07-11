document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const openModalButton = document.getElementById('openModalButton');
    const closeButton = document.getElementsByClassName('close')[0];
    const acceptButton = document.getElementById('acceptButton');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const modeElement = document.getElementById('Mode');

    let selectedHour = '00';
    let selectedMinute = '00';
    let selectedMode = 'AM';

    
    openModalButton.onclick = function() {
        modal.style.display = 'block';
    }

    
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

   
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    const populateCarousel = (container, items, initialSelection, onClick) => {
        const innerContainer = document.createElement('div');
        innerContainer.className = 'scroll-container-inner';

        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'scroll-item';
            div.textContent = item;
            innerContainer.appendChild(div);
        });

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'scroll-item clone';
            div.textContent = item;
            innerContainer.appendChild(div);
        });

        container.appendChild(innerContainer);

        const updateSelection = (selectedValue) => {
            Array.from(innerContainer.children).forEach(item => {
                item.classList.remove('selected');
                if (item.textContent === selectedValue) {
                    item.classList.add('selected');
                }
            });
        };

        updateSelection(initialSelection);

  
        innerContainer.onclick = (event) => {
            if (event.target.classList.contains('scroll-item')) {
                onClick(event.target.textContent);
                updateSelection(event.target.textContent);
            }
        };

        // Controlar el desplazamiento del carrusel
        container.addEventListener('wheel', (event) => {
            event.preventDefault(); // Evita el scroll normal
            const scrollAmount = event.deltaY * .7; // Ajusta la cantidad de desplazamiento
            container.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        });
    };

    const hourItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const amPmItems = ['AM', 'PM'];

    const hourCarousel = document.getElementById('hourCarousel');
    const minuteCarousel = document.getElementById('minuteCarousel');
    const amPmCarousel = document.getElementById('amPmCarousel');

    populateCarousel(hourCarousel, hourItems, selectedHour, (value) => selectedHour = value);
    populateCarousel(minuteCarousel, minuteItems, selectedMinute, (value) => selectedMinute = value);
    populateCarousel(amPmCarousel, amPmItems, selectedMode, (value) => selectedMode = value);

   
    acceptButton.onclick = function() {
        hoursElement.textContent = selectedHour;
        minutesElement.textContent = selectedMinute;
        modeElement.textContent = selectedMode;
        modal.style.display = 'none';
    }
});
