document.addEventListener('DOMContentLoaded', () => {
    const durationModal = document.getElementById('durationModal');
    const openDurationModalButton = document.getElementById('openDurationModalButton');
    const closeDurationButton = document.getElementById('closeDurationModal');
    const setDurationButton = document.getElementById('setDurationButton');
    const currentHoursElement = document.getElementById('currentHours');
    const currentMinutesElement = document.getElementById('currentMinutes');
    const currentModeElement = document.getElementById('currentMode');
    const endHoursElement = document.getElementById('endHours');
    const endMinutesElement = document.getElementById('endMinutes');
    const endModeElement = document.getElementById('endMode');

    let selectedDurationHour = '00';
    let selectedDurationMinute = '00';

    // Función para actualizar el reloj con la hora actual
    const updateClock = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const isPM = hours >= 12;

        const displayHours = String(hours % 12 || 12).padStart(2, '0');
        const displayMinutes = String(minutes).padStart(2, '0');
        const displayMode = isPM ? 'PM' : 'AM';

        currentHoursElement.textContent = displayHours;
        currentMinutesElement.textContent = displayMinutes;
        currentModeElement.textContent = displayMode;
    };

    // Llamar a updateClock cada minuto para mantener la hora actualizada
    updateClock();
    setInterval(updateClock, 60000);

    // Abrir modal para seleccionar duración
    openDurationModalButton.onclick = function() {
        durationModal.style.display = 'block';
    }

    // Cerrar modal para seleccionar duración
    closeDurationButton.onclick = function() {
        durationModal.style.display = 'none';
    }

    // Cerrar modal cuando se hace clic fuera de él
    window.onclick = function(event) {
        if (event.target === durationModal) {
            durationModal.style.display = 'none';
        }
    }

    // Función para poblar los carruseles
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

        container.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scrollAmount = event.deltaY * 0.7;
            container.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        });
    };

    const durationHourItems = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const durationMinuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const durationHourCarousel = document.getElementById('durationHourCarousel');
    const durationMinuteCarousel = document.getElementById('durationMinuteCarousel');

    populateCarousel(durationHourCarousel, durationHourItems, selectedDurationHour, (value) => selectedDurationHour = value);
    populateCarousel(durationMinuteCarousel, durationMinuteItems, selectedDurationMinute, (value) => selectedDurationMinute = value);

    const calculateEndTime = (startHour, startMinute, mode, durationHour, durationMinute) => {
        const startHourNumber = Number(startHour);
        const startMinuteNumber = Number(startMinute);
        const durationHourNumber = Number(durationHour);
        const durationMinuteNumber = Number(durationMinute);

        let startTime = new Date();
        startTime.setHours(startHourNumber % 12 + (mode === 'PM' ? 12 : 0), startMinuteNumber);

        let endTime = new Date(startTime.getTime());
        endTime.setHours(endTime.getHours() + durationHourNumber);
        endTime.setMinutes(endTime.getMinutes() + durationMinuteNumber);

        return {
            hours: String(endTime.getHours() % 12 || 12).padStart(2, '0'),
            minutes: String(endTime.getMinutes()).padStart(2, '0'),
            mode: endTime.getHours() >= 12 ? 'PM' : 'AM'
        };
    };

    setDurationButton.onclick = function() {
        const startHour = currentHoursElement.textContent;
        const startMinute = currentMinutesElement.textContent;
        const mode = currentModeElement.textContent;

        const endTime = calculateEndTime(startHour, startMinute, mode, selectedDurationHour, selectedDurationMinute);

        endHoursElement.textContent = endTime.hours;
        endMinutesElement.textContent = endTime.minutes;
        endModeElement.textContent = endTime.mode;

        durationModal.style.display = 'none';
    }
});
