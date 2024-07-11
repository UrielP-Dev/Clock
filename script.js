document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const durationModal = document.getElementById('durationModal');
    const openModalButton = document.getElementById('openModalButton');
    const openDurationModalButton = document.getElementById('openDurationModalButton');
    const closeButton = document.getElementById('closeModal');
    const closeDurationButton = document.getElementById('closeDurationModal');
    const setTimeButton = document.getElementById('setTimeButton');
    const setDurationButton = document.getElementById('setDurationButton');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const modeElement = document.getElementById('Mode');
    const endHoursElement = document.getElementById('endHours');
    const endMinutesElement = document.getElementById('endMinutes');
    const endModeElement = document.getElementById('endMode');

    let selectedHour = '00';
    let selectedMinute = '00';
    let selectedMode = 'AM';
    let selectedDurationHour = '00';
    let selectedDurationMinute = '00';

    // Abrir modal para seleccionar hora
    openModalButton.onclick = function() {
        modal.style.display = 'block';
    }

    // Abrir modal para seleccionar duración
    openDurationModalButton.onclick = function() {
        modal.style.display = 'none';
        durationModal.style.display = 'block';
    }

    // Cerrar modal para seleccionar hora
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    // Cerrar modal para seleccionar duración
    closeDurationButton.onclick = function() {
        durationModal.style.display = 'none';
    }

    // Cerrar modales cuando se hace clic fuera de ellos
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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

    const hourItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const amPmItems = ['AM', 'PM'];
    const durationHourItems = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const durationMinuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    const hourCarousel = document.getElementById('hourCarousel');
    const minuteCarousel = document.getElementById('minuteCarousel');
    const amPmCarousel = document.getElementById('amPmCarousel');
    const durationHourCarousel = document.getElementById('durationHourCarousel');
    const durationMinuteCarousel = document.getElementById('durationMinuteCarousel');

    populateCarousel(hourCarousel, hourItems, selectedHour, (value) => selectedHour = value);
    populateCarousel(minuteCarousel, minuteItems, selectedMinute, (value) => selectedMinute = value);
    populateCarousel(amPmCarousel, amPmItems, selectedMode, (value) => selectedMode = value);
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

    setTimeButton.onclick = function() {
        durationModal.style.display = 'block';
    }

    setDurationButton.onclick = function() {
        hoursElement.textContent = selectedHour;
        minutesElement.textContent = selectedMinute;
        modeElement.textContent = selectedMode;

        const endTime = calculateEndTime(selectedHour, selectedMinute, selectedMode, selectedDurationHour, selectedDurationMinute);

        endHoursElement.textContent = endTime.hours;
        endMinutesElement.textContent = endTime.minutes;
        endModeElement.textContent = endTime.mode;

        modal.style.display = 'none';
        durationModal.style.display = 'none';
    }
});
