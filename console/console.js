document.addEventListener('DOMContentLoaded', () => {
    const tab = new Array(10).fill(null); 
    const consoleDiv = document.querySelector('.console_c'); 

    const displayDiv = document.createElement('div');
    displayDiv.style.border = '1px solid black';
    displayDiv.style.marginTop = '20px';
    displayDiv.style.marginLeft = '5px'
    displayDiv.style.padding = '10px'; 
    displayDiv.style.backgroundColor = '#101010';
    displayDiv.style.color = '#ffffff';
    displayDiv.style.height = '450px'; //550px sur chrome contre 400px pour mozilla/opera/microsoftedge
    displayDiv.style.width = '1000px';
    displayDiv.style.overflowY = 'auto'; 
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div'); 
        line.textContent = tab[i]; 
        displayDiv.appendChild(line);
    }
    consoleDiv.appendChild(displayDiv); 

    function updateDisplay() {
        displayDiv.childNodes.forEach((line, index) => {
            line.textContent = tab[index]; 
        });
    }

    function handleButtonClick(buttonIndex) {
        if (tab.every((el) => el !== null)) {
            tab.shift(); 
            tab.push(buttonIndex); 
        } else {
            const firstEmptyIndex = tab.indexOf(null);
            tab[firstEmptyIndex] = buttonIndex;
        }
        updateDisplay(); 
    }

    document.querySelectorAll('.but').forEach((button, index) => {
        button.addEventListener('click', () => handleButtonClick(index + 1));
    });
});
