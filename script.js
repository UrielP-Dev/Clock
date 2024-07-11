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
        /* Carrusel infinite */
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'scroll-item clone';
            div.textContent = item;
            innerContainer.appendChild(div);
        });

        container.appendChild(innerContainer);

        const initialIndex = items.findIndex(item => item === initialSelection);
        container.scrollTop = innerContainer.children[initialIndex].offsetTop - (container.clientHeight / 2 - innerContainer.children[0].clientHeight / 2);

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
/* Dimitry */
        container.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop <= 0) {
                container.scrollTop = scrollHeight / 2;
            } else if (scrollTop + clientHeight >= scrollHeight) {
                container.scrollTop = scrollHeight / 2;
            }
            checkSelectedItem();
        });
        const updateAMPMMode = () => {
            if (parseInt(selectedHour, 10) >= 12) {
                selectedMode = parseInt(selectedHour, 10) >= 12 ? 'PM' : 'AM';
                if (parseInt(selectedHour, 10) > 12) {
                    selectedHour = (parseInt(selectedHour, 10) - 12).toString().padStart(2, '0');
                } else if (selectedHour === '12') {
                    selectedMode = 'PM';
                }
            } else {
                selectedMode = 'AM';
                if (selectedHour === '00') {
                    selectedHour = '12';
                }
            }
    
            modeElement.textContent = selectedMode;
    
            const amPmItems = Array.from(document.getElementById('amPmCarousel').children);
            amPmItems.forEach(item => {
                item.classList.remove('selected');
                if (item.textContent === selectedMode) {
                    item.classList.add('selected');
                }
            });
        };
        const checkSelectedItem = () => {
            const items = Array.from(innerContainer.children);
            let closestItem;
            let minDistance = Number.POSITIVE_INFINITY;
/* End Dimitry */
            items.forEach(item => {
                const itemOffsetTop = item.offsetTop;
                const itemHeight = item.clientHeight;
                const itemCenter = itemOffsetTop + itemHeight / 2;
                const containerCenter = container.scrollTop + container.clientHeight / 2;
                const distance = Math.abs(itemCenter - containerCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = item;
                }
            });

            if (closestItem) {
                const itemValue = closestItem.textContent;
                onClick(itemValue);
                updateSelection(itemValue);
                updateAMPMMode();
            }
        };

        checkSelectedItem();
    };

    const populateAmPmSelector = (container, items, initialSelection, onClick) => {
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'scroll-item';
            div.textContent = item;
            container.appendChild(div);
        });

        const updateSelection = (selectedValue) => {
            Array.from(container.children).forEach(item => {
                item.classList.remove('selected');
                if (item.textContent === selectedValue) {
                    item.classList.add('selected');
                }
            });
        };

        updateSelection(initialSelection);

        container.onclick = (event) => {
            if (event.target.classList.contains('scroll-item')) {
                onClick(event.target.textContent);
                updateSelection(event.target.textContent);
            }
        };
    };

    const hourItems = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const amPmItems = ['AM', 'PM'];

    const hourCarousel = document.getElementById('hourCarousel');
    const minuteCarousel = document.getElementById('minuteCarousel');
    const amPmCarousel = document.getElementById('amPmCarousel');

    populateCarousel(hourCarousel, hourItems, selectedHour, (value) => selectedHour = value);
    populateCarousel(minuteCarousel, minuteItems, selectedMinute, (value) => selectedMinute = value);
    populateAmPmSelector(amPmCarousel, amPmItems, selectedMode, (value) => selectedMode = value);
    
    acceptButton.onclick = function() {
        hoursElement.textContent = selectedHour;
        minutesElement.textContent = selectedMinute;
        modeElement.textContent = selectedMode;
        modal.style.display = 'none';
    }
});
